# Research: Netflix Browse Clone

**Feature**: `001-netflix-browse` | **Fecha**: 2026-11-21

No quedan `NEEDS CLARIFICATION` abiertos: la spec los resolvió en la sesión de clarificación. Esta investigación fija las decisiones técnicas que la spec deliberadamente dejó fuera.

## D1. Herramienta de build y versiones

- **Decision**: Vite 5 + React 18.3 + TypeScript 5 (`"strict": true`), Node ≥ 20, npm. Las versiones se fijan en la instalación (`create-vite@5`, `react@18`, `vitest@2`); no se usa `@latest`, que probablemente traería React 19 y un Vite más nuevo, contra la constitución (II).
- **Rationale**: es el stack fijado por la constitución (II). Vite da arranque instantáneo y `vitest` comparte su configuración.
- **Alternatives considered**: Next.js (exige servidor, contradice el principio I); Create React App (obsoleto).

## D2. Enrutado

- **Decision**: `react-router-dom` v6 con `createBrowserRouter`. Rutas: `/profiles`, `/browse`, `/browse/series`, `/browse/movies`, `/browse/new`, `/search`, `/my-list`, `/watch/:id`. La raíz `/` redirige a `/profiles` o a `/browse` si ya hay perfil guardado.
- **Rationale**: la constitución permite esta única dependencia extra. Las URLs distintas hacen el filtrado de Series/Películas/Novedades (FR-026) trivial y comprobable.
- **Alternatives considered**: estado interno sin router (peor para botón atrás y para tests); hash router (innecesario).

## D3. Carrusel hecho a mano

- **Decision**: contenedor con `overflow-x: auto` y `scroll-snap-type: x mandatory`. Las flechas llaman a `scrollBy` por una "página" (ancho visible). Hook `useCarousel` calcula `itemsPerPage` con `matchMedia`: ≥1400 px → 6, ≥1100 → 5, ≥800 → 4, ≥500 → 3, resto → 2. Flechas deshabilitadas según `scrollLeft` y `scrollWidth`.
- **Rationale**: el scroll nativo da gratis el deslizamiento táctil (FR-009) y no hay que sincronizar un estado de índice con un `transform`. Un contenedor con `overflow-x: auto` recorta también en vertical lo que sobresale; por eso la lista reserva espacio para la previsualización (ver D4).
- **Alternatives considered**: `transform: translateX` con índice (más código, el táctil hay que programarlo); librerías Swiper/Slick (prohibidas por la constitución).

## D4. Previsualización de tarjeta

- **Decision**: la tarjeta es un `<li>` de tamaño fijo; la vista ampliada es un elemento `position: absolute` dentro del propio `<li>` (`top: -16px; left: -12%; width: 124%`) que se monta tras 400 ms de `mouseenter` o con `focus-within`. Se cierra con `mouseleave`, pérdida de foco o Escape. En pantallas táctiles (`@media (hover: none)`) no se monta y el toque abre el detalle. Para que el scroll de la fila no la recorte, la lista de la fila lleva `padding` (`--preview-space-top`, `--preview-space-bottom`, `--preview-space-inline`) con el mismo valor en `margin` negativo, y la fila en hover o foco sube de `z-index`.
- **Rationale**: al ser absoluta no desplaza al resto de la fila (FR-011); el relleno reserva sitio dentro del contenedor con scroll sin alterar el diseño, y al seguir dentro del `<li>` se conserva el orden de tabulación del teclado (principio III).
- **Alternatives considered**: ampliar la propia tarjeta con `transform` en CSS puro (no permite el retardo ni el cierre con Escape); renderizar la previsualización en un portal con `position: fixed` (evita el recorte, pero rompe el orden de tabulación porque los botones quedan al final del documento).

## D5. Modal accesible

- **Decision**: componente `Modal` propio con `createPortal`, hook `useFocusTrap` (Tab y Shift+Tab cíclicos), cierre con Escape, botón X o clic en el fondo, y restauración del foco al elemento que lo abrió. `role="dialog"`, `aria-modal="true"` y `aria-labelledby`.
- **Rationale**: exigido por la constitución (III) y FR-015. Sin librería de UI.
- **Alternatives considered**: `<dialog>` nativo (el comportamiento de foco varía entre navegadores y es más difícil de probar con jsdom).

## D6. Estado global y persistencia

- **Decision**: React Context con dos proveedores: `ProfileProvider` (perfil activo) y `MyListProvider` (títulos guardados por perfil). Persistencia en `localStorage` con prefijo `nbc:`, lectura protegida con `try/catch` y valores por defecto ante datos corruptos (caso límite de la spec).
- **Rationale**: dos contextos pequeños bastan; no hace falta un gestor de estado externo (principio VII).
- **Alternatives considered**: Redux/Zustand (dependencias sin justificación); IndexedDB (excesivo para una lista de ids).

## D7. Datos del catálogo

- **Decision**: ficheros JSON importados en tiempo de build desde `src/data/` (`catalog.json`, `rows.json`, `profiles.json`, `notifications.json`) con `resolveJsonModule`, y una capa tipada en `src/data/catalog.ts`. Imágenes y vídeo en `public/assets/`.
- **Rationale**: cumple el principio I (sin red) y mantiene los datos separados de la UI (V). Importar evita estados de carga.
- **Alternatives considered**: `fetch` de JSON desde `public/` (añade estados de carga y errores sin necesidad).

## D8. Vídeo único

- **Decision**: un único clip `public/assets/video/sample.mp4` (silenciado, `playsInline`, `loop` en el hero) reutilizado en el hero y en el reproductor. Con `prefers-reduced-motion` el hero muestra el banner estático en lugar del vídeo.
- **Rationale**: decidido en la clarificación. Reduce activos.
- **Alternatives considered**: clip por título (muchos activos para una demo).

## D9. Reproductor

- **Decision**: elemento `<video>` nativo sin atributo `controls`, con barra de controles propia (reproducir/pausar, volumen, progreso, pantalla completa, volver) y atajos: espacio, ← →, `F`, `M`, Escape.
- **Rationale**: FR-022 y FR-023 piden controles y teclado concretos.
- **Alternatives considered**: `controls` nativos (no permite los atajos exigidos ni la identidad visual).

## D10. Búsqueda

- **Decision**: hook `useDebouncedValue` (250 ms) y función pura `searchTitles(query, titles)` que coincide por nombre, género o reparto, sin distinguir mayúsculas ni acentos (`normalize('NFD')`). Consulta vacía o solo espacios → sin filtrar y vuelta al inicio.
- **Rationale**: lógica pura fácil de probar; cumple SC-007 por margen amplio con ~60 títulos.
- **Alternatives considered**: búsqueda difusa con librería (innecesaria).

## D11. Perfil Infantil

- **Decision**: `Profile.isKids`. Función pura `filterByProfile(titles, profile)` que, si `isKids`, conserva solo `rating` en `['TP','7+']`. Se aplica a todas las filas, a la búsqueda y a Mi lista.
- **Rationale**: criterio fijado en la clarificación; una sola función evita fugas de contenido.

## D12. Estilos

- **Decision**: CSS Modules por componente y `src/styles/tokens.css` con variables (colores, espaciado, tipografía, z-index, breakpoints). Tema oscuro por defecto. Fuente del sistema.
- **Rationale**: constitución II. Sin Tailwind ni librerías de UI.

## D13. Pruebas y calidad

- **Decision**: Vitest + jsdom + `@testing-library/react`, `@testing-library/user-event` y `@testing-library/jest-dom`. Selectores por `data-testid` (contrato en `contracts/testids.md`). ESLint con `typescript-eslint`. Scripts: `dev`, `build`, `preview`, `test`, `typecheck`, `lint`.
- **Rationale**: constitución V y VI. Las herramientas de test y lint son `devDependencies`, no dependencias de ejecución; la constitución restringe solo estas últimas.
- **Alternatives considered**: Jest (más configuración con Vite); Cypress/Playwright (fuera de alcance de la demo).

## D14. Accesibilidad

- **Decision**: HTML semántico (`header`, `nav`, `main`, `section`, `ul/li`), enlace "Saltar al contenido", foco visible global con `:focus-visible`, selectores de test solo por `data-testid` (constitución V; `role` y `aria-*` sirven para accesibilidad, no como selector) y `prefers-reduced-motion` en CSS y en el hook `useReducedMotion`. Contraste verificado a mano sobre los tokens de color.
- **Rationale**: principio III. No se añade `jest-axe` para mantener las dependencias mínimas.

## D15. Rendimiento

- **Decision**: `loading="lazy"` y atributos `width`/`height` en todas las imágenes, el vídeo con `preload="metadata"`, y `React.lazy` solo para la página del reproductor.
- **Rationale**: SC-005 (contenido usable en < 3 s) con una carga inicial pequeña.

## D16. Artefactos para un modelo implementador pequeño

- **Decision**: las tareas se reparten en fichas por fase (`phases/PNN-*.md`, < 7 KB) con campos fijos (Crea, Contrato, Hecho cuando), reglas comunes en `IMPLEMENT.md` e índice con casillas en `tasks.md`. Un componente compartido `SafeImage` centraliza `loading="lazy"`, dimensiones y la imagen sustituta.
- **Rationale**: con ~25k tokens de sobrecarga del arnés y un límite de prompt de 40k, un `tasks.md` monolítico de ~16k tokens deja sin margen al modelo local. Fichas pequeñas y autocontenidas reducen alucinaciones y permiten verificar cada tarea.
- **Alternatives considered**: un único `tasks.md` detallado (demasiado grande); una tarea por fichero (cientos de ficheros, más coste de apertura).
