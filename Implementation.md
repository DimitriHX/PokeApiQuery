🗺️ Plan de Implementación: PokéQuery Optimizer (Edition Panda CSS)

  Fase 1: Infraestructura y Entorno (El Cimiento)
  1.  Validación de Docker: Revisión y optimización del Dockerfile y docker-compose.yml para asegurar Hot Reload y persistencia de
  node_modules.
  2.  Inicialización de Next.js: Creación del proyecto con App Router y
  TypeScript.
  3.  Configuración de Panda CSS:
  *   Instalación y configuración del panda.config.ts.
  *   Tipografía: Configurar Arial como la fuente principal en el tema
  global.
  *   Definición de tokens de color basados en los tipos de Pokémon.
  4.  Setup de TanStack Query:
  *   Creación del QueryClientProvider (Client Component).
  *   Configuración global de staleTime (24h) y gcTime.

  Fase 2: Capa de Datos y Tipado (La Inteligencia)
  1.  TypeScript Interfaces: Definir tipos estrictos para Pokemon, PokemonDetail, Ability, Stat, etc., basados en la
  PokéAPI.
  2.  Service Layer: Crear services/pokemon.ts con funciones optimizadas
  para:
  *   Fetch de lista paginada.
  *   Fetch de detalles por ID/Nombre.

  Fase 3: Implementación del Servidor y Hydration (El Corazón de la Tarea)
  1.  Página Principal (RSC):
  *   Implementar la página como Server Component.
  *   Lógica de Prefetching: Crear el QueryClient en el servidor, ejecutar prefetchQuery para los primeros 50
  Pokémon.
  *   Deshidratación: Usar dehydrate(queryClient) para pasar el estado al
  cliente.
  2.  Hydration Boundary: Envolver la vista de la lista en <HydrationBoundary> para eliminar el estado de carga inicial en el
  cliente.
  3.  Componente de Lista: Crear la cuadrícula de Pokémon usando Panda
  CSS.

  Fase 4: Estrategias Avanzadas de Cliente (La Optimización)
  1.  Prefetching on Hover:
  *   Convertir la tarjeta de Pokémon en un Client Component.
  *   Implementar onMouseEnter $\rightarrow$ queryClient.prefetchQuery para los detalles del
  Pokémon.
  2.  Ruta Dinámica de Detalle:
  *   Crear /pokemon/[name].
  *   Implementar la vista de detalle con stats, tipos y sprites.
  *   Verificar que la navegación sea instantánea gracias al prefetch.
  3.  Paginación/Infinite Scroll: Implementar la carga de más Pokémon sin perder el estado de la
  caché.

  Fase 5: Pulido, Validación y Despliegue (El Acabado)
  1.  UX/UI: Implementar Skeleton screens y manejo de errores global.
  2.  Auditoría de Caché: Usar TanStack Devtools para confirmar que los datos permanecen "fresh" durante
  24h.
  3.  Documentación: Redactar el README explicando la estrategia de transferencia de datos y la configuración de Panda
  CSS.
  4.  Deployment: Conectar el repositorio a Vercel para el despliegue
  final.
