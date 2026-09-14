Optimización de Transferencia de Datos: Implementación de TanStack Query y Estrategias Avanzadas de Caché en Aplicaciones Modernas
Requisitos de finalización
Apertura: lunes, 7 de septiembre de 2026, 00:00
Cierre: domingo, 13 de septiembre de 2026, 23:59
⚡ Actividad Práctica
Optimización de Transferencia de Datos con TanStack Query

Descripción (No evaluada): Optimizar el rendimiento de aplicaciones web mediante React Server Components, prefetching estratégico y gestión eficiente de caché, implementando técnicas avanzadas de hydration y carga anticipada de datos para garantizar experiencias de usuario fluidas y reducir la latencia en aplicaciones modernas desarrolladas con Next.js.

Título de la actividad: Optimización de Transferencia de Datos: Implementación de TanStack Query y Estrategias Avanzadas de Caché en Aplicaciones Modernas

⚙️ Indicaciones
Requisitos Técnicos
1. Stack Tecnológico
Next.js 16+ utilizando App Router
React Server Components (RSC)
TanStack Query (React Query) v5
TypeScript (obligatorio)
PokéAPI – https://pokeapi.co/
🧩 Funcionalidades Obligatorias
a) Lista de Pokémon (Servidor)
Implementar la página principal como React Server Component.
Obtener y renderizar una lista de al menos 50 Pokémon desde el servidor.
Mostrar nombre e imagen de cada Pokémon en tarjetas visuales.
Aplicar paginación o infinite scroll.
b) Prefetching en Hover
Implementar prefetchQuery cuando el usuario pase el mouse sobre una tarjeta.
Pre-cargar datos detallados del Pokémon (stats, tipos, habilidades, evoluciones).
Usar onMouseEnter para disparar el prefetch.
c) Hydration Boundary
Utilizar <HydrationBoundary> para transferir datos del servidor al cliente.
Configurar dehydrate en el servidor para incluir datos iniciales.
Garantizar una transición fluida entre servidor y cliente.
d) Página de Detalle
Crear ruta dinámica /pokemon/[id] o /pokemon/[name].
Mostrar información completa: stats, tipos, habilidades, cadena evolutiva y sprites.
Los datos deben estar disponibles instantáneamente si fueron prefetched.
🗄️ Configuración de Caché
Configurar staleTime: 24 * 60 * 60 * 1000 (24 horas) en TanStack Query.
Configurar adecuadamente gcTime.
Documentar la estrategia de caché en el README del proyecto.
🧠 Mejores Prácticas
Separación clara entre Server Components y Client Components.
Manejo apropiado de estados de carga y errores.
Uso de TypeScript con tipado completo de las respuestas de la API.
Código limpio, modular y bien organizado.


opencode -s ses_f5fae60e7ffeBUEvmA0FGovlUc
