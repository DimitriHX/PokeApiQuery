# PokeQuery Optimizer

Aplicación Pokédex moderna de alto rendimiento construida con **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Panda CSS** y **TanStack Query v5**.

El proyecto implementa técnicas avanzadas de renderizado híbrido (**React Server Components + Client Components**), prefetching predictivo sensible a eventos (hover y foco de teclado), transferencia deshidratada de estado mediante `<HydrationBoundary>` y una estrategia de caché multinivel de 24 horas para garantizar navegaciones instantáneas sin latencia percibida.

---

## Índice

- [Características Principales](#características-principales)
- [Arquitectura y Cómo se Realizó](#arquitectura-y-cómo-se-realizó)
  - [1. Renderizado en Servidor e Hidratación (RSC)](#1-renderizado-en-servidor-e-hidratación-rsc)
  - [2. Prefetching Predictivo y Accesible](#2-prefetching-predictivo-y-accesible)
  - [3. Estrategia Multinivel de Caché](#3-estrategia-multinivel-de-caché)
  - [4. Paginación Fluida con `keepPreviousData`](#4-paginación-fluida-con-keeppreviousdata)
  - [5. Skeletons Visuales y UX Industrial](#5-skeletons-visuales-y-ux-industrial)
  - [6. Sistema de Localización y Búsqueda en Español](#6-sistema-de-localización-y-búsqueda-en-español)
  - [7. Estilos Zero-Runtime con Panda CSS](#7-estilos-zero-runtime-con-panda-css)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Cómo Montar y Ejecutar el Proyecto](#cómo-montar-y-ejecutar-el-proyecto)
  - [Opción 1: Con Docker (Recomendada)](#opción-1-con-docker-recomendada)
  - [Opción 2: En Entorno Local con npm](#opción-2-en-entorno-local-con-npm)
- [Pipeline de Datos en Español (PokéAPI CSVs)](#pipeline-de-datos-en-español-pokéapi-csvs)
- [Pruebas Automatizadas y Calidad](#pruebas-automatizadas-y-calidad)

---

## Características Principales

- **Cero Flashes de Carga Inicial**: La lista inicial de 50 Pokémon se obtiene y pre-renderiza directamente en el servidor.
- **Navegación Instantánea a Detalle**: Al pasar el ratón (`onMouseEnter`) o hacer foco con el teclado (`onFocus`) sobre cualquier tarjeta, se disparan en segundo plano los detalles (estadísticas, tipos, habilidades y cadena evolutiva).
- **Caché Persistente**: Configuración de `staleTime: 24h` y `gcTime: 48h` con TanStack Query y revalidación de 24h a nivel de peticiones HTTP en el servidor de Next.js.
- **Localización Oficial Completa**: Especies, estadísticas, tipos y habilidades completamente en español extraídos de los datasets CSV de PokéAPI.
- **Búsqueda Normalizada**: Localiza Pokémon al instante por nombre en español o número de Pokédex sin tildes ni caracteres especiales.
- **Paginación sin Saltos de Pantalla**: Uso de `placeholderData: keepPreviousData` para transicionar suavemente entre páginas.
- **Diseño Neo-Brutalista Responsive**: Estética industrial, tipografía Oxanium, paletas temáticas por color y soporte completo para lectores de pantalla y teclado.

---

## Arquitectura y Cómo se Realizó

### 1. Renderizado en Servidor e Hidratación (RSC)

La página principal (`app/page.tsx`) y la página de detalle (`app/pokemon/[name]/page.tsx`) operan como **React Server Components**:

```tsx
// app/page.tsx
export default async function HomePage() {
  const queryClient = createQueryClient();
  
  // 1. Precarga en servidor
  await queryClient.prefetchQuery({
    queryKey: pokemonKeys.list(0, 50),
    queryFn: () => getPokemonList(0, 50),
  });

  return (
    <main>
      {/* 2. Transferencia deshidratada al cliente */}
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Pokedex />
      </HydrationBoundary>
    </main>
  );
}
```

- En el servidor, se instancia un `QueryClient` nuevo y aislado por petición.
- Se ejecuta `prefetchQuery` para los primeros 50 registros.
- Se serializa el estado mediante `dehydrate(queryClient)`.
- El componente de cliente `<Pokedex />` se monta dentro de `<HydrationBoundary>`, encontrando los datos ya disponibles en la memoria sin disparar una petición de red adicional ni pantallas en blanco.

### 2. Prefetching Predictivo y Accesible

En `components/pokemon-card.tsx`, cada tarjeta anticipa la intención del usuario:

```tsx
export function PokemonCard({ pokemon }: { pokemon: PokemonSummary }) {
  const queryClient = useQueryClient();

  function prefetchDetail() {
    void queryClient.prefetchQuery({
      queryKey: pokemonKeys.detail(pokemon.name),
      queryFn: () => getPokemonDetail(pokemon.name),
    });
  }

  return (
    <Link
      href={`/pokemon/${pokemon.name}`}
      onMouseEnter={prefetchDetail}
      onFocus={prefetchDetail} // Accesibilidad para navegación con Tab
    >
      ...
    </Link>
  );
}
```

Al interactuar con la tarjeta, el cliente descarga en segundo plano:
1. Datos base del Pokémon (`/pokemon/{id}`).
2. Información de la especie (`/pokemon-species/{id}`).
3. Cadena evolutiva completa en árbol (`/evolution-chain/{id}`).

Cuando el usuario hace clic, la ruta `/pokemon/[name]` abre de forma **instantánea** desde la memoria de TanStack Query.

### 3. Estrategia Multinivel de Caché

Se configuró una política de frescura uniforme en las capas de cliente y servidor (`lib/query-client.ts` y `lib/pokemon.ts`):

- **`staleTime: 86400000` (24 horas)**: Los datos consultados se consideran "frescos" durante un día completo, evitando re-peticiones innecesarias en navegación interna.
- **`gcTime: 172800000` (48 horas)**: Las consultas permanecen en el recolector de basura de la memoria durante 2 días antes de ser eliminadas.
- **Next.js Data Cache**: `apiFetch` incluye `next: { revalidate: 86400 }` para que la caché del servidor conserve las respuestas de la PokéAPI y no sobrecargue los servidores upstream.

### 4. Paginación Fluida con `keepPreviousData`

En `components/pokedex.tsx`, la llamada a `useQuery` incorpora `placeholderData: keepPreviousData`:

```tsx
const { data, error, isFetching } = useQuery({
  queryKey: pokemonKeys.list(offset, pageSize, color),
  queryFn: () => getPokemonList(offset, pageSize, color),
  placeholderData: keepPreviousData,
});
```

Esto garantiza que al cambiar de página (ej. de la 1 a la 2), la cuadrícula existente permanezca en pantalla con una suave transición visual hasta que los datos de la nueva página terminen de cargarse, eliminando cualquier salto de diseño (*layout shift*).

### 5. Skeletons Visuales y UX Industrial

Se implementaron componentes de carga visual (`components/pokemon-skeleton.tsx`) que respetan la geometría y proporciones de las tarjetas brutales:
- `PokemonCardSkeleton`: Imita la tarjeta de registro con animación pulsante.
- `PokemonGridSkeleton`: Cuadrícula responsiva que sustituye el texto plano en `app/loading.tsx` y en caídas de red.
- `PokemonDetailSkeleton`: Esqueleto completo de la ficha técnica con barras de estadísticas vacías.

### 6. Sistema de Localización y Búsqueda en Español

A diferencia de las implementaciones habituales en inglés, este proyecto cuenta con un módulo de localización:
- **`scripts/generate_locales.py`**: Descarga y cruza los CSV oficiales de PokéAPI en el idioma español (`es`).
- **`lib/colors.ts`**: Módulo desacoplado con los colores oficiales de los Pokémon y sus códigos hexadecimales, evitando arrastrar datasets pesados al bundle de las tarjetas.
- **Búsqueda Diacrítica**: `findPokemonIdentifier` normaliza cadenas (eliminando tildes, mayúsculas y espacios) para permitir búsquedas directas como `"pikachu"`, `"25"` o `"chikorita"`.

### 7. Estilos Zero-Runtime con Panda CSS

Se utiliza **Panda CSS** (`panda.config.ts`), un motor CSS-in-JS moderno que genera clases CSS estándar en tiempo de compilación:
- Sin sobrecoste de tiempo de ejecución en el navegador.
- Tokens para tipografía (`Oxanium`, `Arial`) y colores temáticos.
- Diseño accesible con indicadores visuales claros para `:focus-visible`.

---

## Estructura del Proyecto

```text
pokeapiTypeScript/
├── app/
│   ├── error.tsx                  # Error boundary global con botón de reintento
│   ├── globals.css                # Capas CSS y animación de pulso
│   ├── layout.tsx                 # Root layout con tipografía Oxanium y QueryProvider
│   ├── loading.tsx                # Skeleton UI para la carga de la página principal
│   ├── page.tsx                   # RSC: Prefetch y deshidratación de lista inicial
│   └── pokemon/
│       └── [name]/
│           ├── not-found.tsx      # Vista 404 para Pokémon inexistentes
│           └── page.tsx           # RSC: Prefetch y deshidratación de la vista de detalle
├── components/
│   ├── pokedex.tsx                # Componente cliente interactivo: búsqueda, filtros y paginación
│   ├── pokemon-card.tsx           # Tarjeta con prefetch predictivo en hover y focus
│   ├── pokemon-detail.tsx         # Ficha técnica: stats, tipos, evoluciones y habilidades
│   ├── pokemon-skeleton.tsx       # Esqueletos visuales de tarjeta, cuadrícula y detalle
│   └── query-provider.tsx         # Contenedor del QueryClientProvider de TanStack
├── data/
│   ├── correcciones-es.json       # Correcciones editoriales manuales sobre el dataset oficial
│   └── pokemon-es.json            # Diccionario compilado de traducción y catálogo
├── lib/
│   ├── colors.ts                  # Constantes y tokens de colores desacoplados
│   ├── localization.ts            # Utilidades de traducción, búsqueda y utilidades de color
│   ├── pokemon.ts                 # Capa de servicios y definición de Query Keys
│   ├── query-client.ts            # Factoría del QueryClient (staleTime 24h, gcTime 48h)
│   └── types.ts                   # Interfaces estrictas de TypeScript para PokéAPI
├── scripts/
│   └── generate_locales.py        # Generador del dataset en español desde CSVs de PokéAPI
├── tests/
│   ├── localization.test.ts       # Pruebas de traducción, búsqueda y colores
│   ├── pokemon.test.ts            # Pruebas de query keys y servicio de datos
│   └── query-client.test.ts       # Pruebas de configuración de caché
├── Dockerfile                     # Construcción multi-stage (desarrollo y producción standalone)
├── Docker-Nextjs.yml              # Compose para entorno de desarrollo con hot reload
├── panda.config.ts                # Configuración de tokens y temas de Panda CSS
└── tsconfig.json                  # Configuración estricta de TypeScript
```

---

## Cómo Montar y Ejecutar el Proyecto

### Opción 1: Con Docker (Recomendada)

#### A. Entorno de Desarrollo (Hot Reload y volúmenes montados)

El archivo `Docker-Nextjs.yml` levanta un contenedor sincronizado con tu directorio local, protegiendo `node_modules` y `.next` mediante volúmenes independientes:

```bash
docker compose -f Docker-Nextjs.yml up --build
```

- La aplicación estará disponible en: **`http://localhost:3000`**.
- Cualquier cambio realizado en el código local se reflejará en tiempo real gracias a `WATCHPACK_POLLING=true`.
- Para detener el contenedor:
  ```bash
  docker compose -f Docker-Nextjs.yml down
  ```

#### B. Entorno de Producción Optimizado (Multi-Stage Standalone)

El `Dockerfile` incluye una etapa `production` optimizada con usuario no privilegiado `nextjs` y `output: "standalone"`:

```bash
# 1. Compilar la imagen de producción
docker build -t poke-query-optimizer:prod .

# 2. Ejecutar el contenedor
docker run -p 3000:3000 --name poke-prod poke-query-optimizer:prod
```

---

### Opción 2: En Entorno Local con npm

#### Requisitos Previos

- **Node.js**: v20.0.0 o superior (recomendado v22+).
- **npm**: v10.0.0 o superior.

#### 1. Instalación de Dependencias

```bash
npm install
```

#### 2. Generar el Sistema de Estilos Panda CSS

```bash
npm run panda:generate
```

#### 3. Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

Abre tu navegador en: **`http://localhost:3000`**.

#### 4. Compilar y Ejecutar en Producción

```bash
# Compilar la aplicación optimizada
npm run build

# Iniciar el servidor de producción
npm run start
```

---

## Pipeline de Datos en Español (PokéAPI CSVs)

El proyecto incluye un script en Python que genera el archivo `data/pokemon-es.json` directamente desde el repositorio oficial de PokéAPI:

```bash
npm run locales:generate
```

*Nota: Requiere Python 3 instalado en el entorno anfitrión.*

Si deseas corregir o personalizar nombres, puedes agregarlos en `data/correcciones-es.json` y volver a ejecutar el comando anterior.

---

## Pruebas Automatizadas y Calidad

El proyecto cuenta con una suite completa de pruebas unitarias configurada con **Vitest**:

```bash
# Ejecutar todas las pruebas unitarias
npm test

# Modo observador (TDD)
npm run test:watch
```

### Verificación de Linter y Tipado

```bash
# Validar reglas de ESLint
npm run lint

# Validar compilación de producción completa
npm run build
```
