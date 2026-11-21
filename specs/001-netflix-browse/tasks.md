---

description: "Task list for Netflix Browse Clone"
---

# Tasks: Netflix Browse Clone

**Input**: Design documents from `/specs/001-netflix-browse/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ (types.ts, hooks.md, routes.md, testids.md)

**Tests**: incluidos. La constitución (V y VI) exige pruebas de la lógica clave y la puerta `typecheck` + `test` + `build` en cada historia.

**Organization**: tareas agrupadas por historia para implementarla y probarla de forma independiente. Cada tarea toca **un fichero** (dos como máximo: código + su prueba o su CSS).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: se puede hacer en paralelo (ficheros distintos, sin dependencias entre ellas)
- **[Story]**: historia a la que pertenece (US1…US9)
- **[MANUAL]**: la hace una persona; el modelo no puede
- Todas las rutas son relativas a `/Users/jorgefdezsa/Sources/Netflix`

## Reglas para quien implementa (modelo de código)

- Haz **una tarea cada vez**, en orden, y márcala `[X]` al terminar.
- Usa **exactamente** los nombres de props, funciones, rutas y `data-testid` indicados; vienen de `contracts/`.
- No añadas dependencias ni ficheros que no estén en la tarea. Textos de interfaz en español (es-ES); identificadores en inglés.
- Cada fase termina con una tarea **GATE**: ejecuta el comando, corrige los fallos y **no pases a la fase siguiente** si no está en verde.
- Imágenes: `loading="lazy"`, atributos `width` y `height` y `onError` que, solo si el `src` actual no termina en `/assets/placeholder.svg`, lo cambia a `/assets/placeholder.svg` (la guarda evita un bucle). Estilos: solo CSS Modules y variables de `tokens.css`.
- Pruebas: selecciona **solo con `data-testid`** (constitución V); `role` y `aria-*` se comprueban con `getAttribute` o `toHaveAttribute`, nunca como selector.

## Datos de referencia (para las tareas de datos)

**Catálogo** (60 títulos, ids `t-001`…`t-060`, 10 por fichero):

| Fichero | Ids | Tipo | Géneros | Clasificación (`rating`) |
|---|---|---|---|---|
| `titles-01.json` | t-001–t-010 | movie | Acción, Aventura | 12+ y 16+ |
| `titles-02.json` | t-011–t-020 | movie | Comedia, Familia, Animación | `TP` y `7+` |
| `titles-03.json` | t-021–t-030 | movie | Drama, Suspense | 12+, 16+ y 18+ |
| `titles-04.json` | t-031–t-040 | series | Drama | 12+ y 16+ |
| `titles-05.json` | t-041–t-050 | series | Comedia, Animación | `TP` y `7+` |
| `titles-06.json` | t-051–t-060 | series | Suspense, Ciencia ficción | 12+, 16+ y 18+ |

Reglas: nombres y reparto **ficticios**, sinopsis de 1–2 frases en español. `poster` = `/assets/posters/<id>.svg`, `banner` = `/assets/banners/<id>.svg`, sin `logo`. Películas con `durationMinutes` (80–150). Series con 2 temporadas de 3 episodios (`durationMinutes` 40–55). `addedAt` reciente (≥ 2026-10-01) solo en t-006–t-010, t-036–t-040, t-046–t-050 y t-051–t-056; el resto anterior a 2026-10-01.

**Filas** (`rows.json`):

| id | name | kind | views | titleIds |
|---|---|---|---|---|
| r-trending | Tendencias | standard | home | t-001–t-004, t-011–t-014, t-031–t-034 |
| r-top10 | Top 10 en España | top10 | home | t-001, t-031, t-011, t-021, t-032, t-002, t-041, t-012, t-022, t-033 |
| r-because | Porque has visto… | standard | home | t-021–t-030 |
| r-series | Series de TV | standard | home, series | t-031–t-040 |
| r-action | Películas de acción | standard | home, movies | t-001–t-010 |
| r-family | Para toda la familia | standard | home, movies | t-011–t-020 |
| r-drama | Dramas premiados | standard | movies | t-021–t-030 |
| r-series-comedy | Comedias y animación | standard | series | t-041–t-050 |
| r-series-thriller | Suspense y ciencia ficción | standard | series | t-051–t-060 |
| r-new | Novedades populares | standard | new | t-006–t-010, t-036–t-040, t-046–t-050 |
| r-new-series | Estrenos de series | standard | new | t-051–t-056 |

**Perfiles**: `p-1` Jorge, `p-2` Ana, `p-3` Marcos (todos `isKids: false`) y `p-4` Infantil (`isKids: true`); `avatar` = `/assets/avatars/<id>.svg`. **Destacado**: `FEATURED_ID = 't-001'`.

---

## Phase 1: Setup (Shared Infrastructure)

**Checkpoint (al terminar)**: el proyecto Vite + React + TypeScript compila (`npm run build`) con una página mínima, y `npm test` se ejecuta sin errores.

- [ ] T001 Ejecutar en la raíz `npm create vite@5 . -- --template react-ts` (elegir "Ignore files and continue") y después `npm install`. **No usar `@latest`**: traería versiones más nuevas que las fijadas por la constitución y el plan. Crea `package.json`, `tsconfig*.json`, `vite.config.ts`, la configuración de ESLint de la plantilla y `src/`. Verificar con `npm ls react vite`: React 18.x y Vite 5.x.
- [ ] T002 Ejecutar `npm install react-router-dom@6` y `npm install -D vitest@2 jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom` (Vitest 2 es compatible con Vite 5). Si la plantilla no incluyera ESLint con typescript-eslint, instalarlos también.
- [ ] T003 Editar `package.json` (solo `scripts`): `"test": "vitest run --passWithNoTests"`, `"typecheck": "tsc -b"`, `"assets": "node scripts/generate-placeholders.mjs"`; conservar `dev`, `build`, `preview` y `lint`.
- [ ] T004 Editar `vite.config.ts`: importar `defineConfig` desde `'vitest/config'`, mantener el plugin de React y añadir `test: { environment: 'jsdom', globals: true, setupFiles: './src/test/setup.ts' }`.
- [ ] T005 Crear `src/test/setup.ts`: `import '@testing-library/jest-dom/vitest'`; simular `window.matchMedia` (devuelve `{ matches: false, addEventListener, removeEventListener, addListener, removeListener }`); definir `Element.prototype.scrollBy = () => {}`; `HTMLMediaElement.prototype.play = () => Promise.resolve()`, `pause = () => {}` y `load = () => {}`; `afterEach(() => localStorage.clear())`.
- [ ] T006 Editar `tsconfig.app.json`: asegurar `"strict": true`, añadir `"resolveJsonModule": true` y `"types": ["vite/client", "vitest/globals"]`.
- [ ] T007 [P] Crear `src/types/index.ts` copiando literalmente `specs/001-netflix-browse/contracts/types.ts`.
- [ ] T008 [P] Borrar `src/App.tsx`, `src/App.css`, `src/index.css`, `src/assets/react.svg` y `public/vite.svg`; reescribir `src/main.tsx` para renderizar solo `<div>Netflix Browse Clone</div>` con `createRoot` sin importar CSS.
- [ ] T009 [P] Editar `index.html`: `<html lang="es">`, `<title>Netflix Browse Clone</title>`, quitar el enlace al icono `vite.svg`.
- [ ] T010 **GATE Setup**: ejecutar `npm run typecheck && npm test && npm run build` y `npm ls react vite vitest` (debe mostrar React 18.x y Vite 5.x). Corregir lo que falle.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: tipos, estilos base, lógica pura, datos, contextos y estructura de rutas de los que dependen todas las historias.

**⚠️ CRITICAL**: ninguna historia puede empezar hasta terminar esta fase.

**Checkpoint (al terminar)**: existen estilos base, 6 funciones puras probadas, el catálogo validado (60 títulos), los proveedores de perfil, Mi lista y modal, y la app arranca con rutas vacías. `npm test` y `npm run build` en verde.

### Estilos base

- [ ] T011 Crear `src/styles/tokens.css` con `:root` y variables: colores (`--color-bg: #141414`, `--color-surface: #1f1f1f`, `--color-text: #ffffff`, `--color-text-muted: #b3b3b3`, `--color-accent: #e50914`, `--color-focus: #ffffff`), espaciado (`--space-1: 4px` … `--space-6: 48px`), tipografía (`--font-family: system-ui, sans-serif`), z-index (`--z-header: 100`, `--z-preview: 50`, `--z-modal: 200`), espacio reservado para la previsualización (`--preview-space-top: 24px`, `--preview-space-bottom: 160px`, `--preview-space-inline: 32px`) y `--header-height: 68px`.
- [ ] T012 Crear `src/styles/global.css`: `@import './tokens.css';`; reset (`box-sizing: border-box`, `margin: 0`); `body` con fondo `var(--color-bg)`, color `var(--color-text)` y `font-family: var(--font-family)`; `html { color-scheme: dark }`; `:focus-visible { outline: 3px solid var(--color-focus); outline-offset: 2px }`; clases `.sr-only` (oculta visualmente) y `.skip-link` (fuera de pantalla hasta recibir foco); `button { font: inherit; cursor: pointer }`; `overflow-x: hidden` en `body`; bloque `@media (prefers-reduced-motion: reduce)` que fuerza `animation-duration`, `transition-duration` a `0.01ms` y `scroll-behavior: auto`.

### Lógica pura (cada una con su prueba)

- [ ] T013 [P] Crear `src/lib/storage.ts` y `src/lib/storage.test.ts`: `readJson<T>(key, fallback, guard)` (try/catch; si no hay valor, JSON inválido o `guard` falla → `fallback`) y `writeJson(key, value)` (try/catch silencioso). Pruebas: valor válido, ausente, JSON roto y tipo inválido.
- [ ] T014 [P] Crear `src/lib/filterByProfile.ts` y su prueba: `filterByProfile(titles, profile)`; si `profile?.isKids` conserva solo `rating` en `KIDS_RATINGS` (`'TP'`, `'7+'`); si no, devuelve `titles`. Importar tipos de `src/types`.
- [ ] T015 [P] Crear `src/lib/searchTitles.ts` y su prueba: `searchTitles(query, titles)`; normaliza con `normalize('NFD')` y quita diacríticos, minúsculas; coincide si la consulta está en `name`, algún `genres` o algún `cast`; consulta vacía o solo espacios → `[]`.
- [ ] T016 [P] Crear `src/lib/rowsForView.ts` y su prueba: `rowsForView(rows, view)` devuelve las filas cuyo `views` incluye `view`, conservando el orden.
- [ ] T017 [P] Crear `src/lib/pageSize.ts` y su prueba: `itemsPerPage(width)`: ≥1400 → 6, ≥1100 → 5, ≥800 → 4, ≥500 → 3, resto → 2.
- [ ] T018 [P] Crear `src/lib/formatDuration.ts` y su prueba: `formatDuration(minutes)`: `95` → `"1 h 35 min"`, `45` → `"45 min"`, `120` → `"2 h"`.

### Datos del catálogo

- [ ] T019 [P] Crear `src/data/profiles.json`: array con los 4 perfiles de "Datos de referencia" (`id`, `name`, `avatar`, `isKids`).
- [ ] T020 [P] Crear `src/data/notifications.json`: 3 avisos `{ id: "n-1".."n-3", text, date }` en español (por ejemplo "Nueva temporada disponible", "Tu lista tiene novedades", "Recomendado para ti").
- [ ] T021 [P] Crear `src/data/titles-01.json`: 10 películas t-001…t-010 según la tabla de referencia (todos los campos de `Title`).
- [ ] T022 [P] Crear `src/data/titles-02.json`: 10 películas t-011…t-020 según la tabla de referencia.
- [ ] T023 [P] Crear `src/data/titles-03.json`: 10 películas t-021…t-030 según la tabla de referencia.
- [ ] T024 [P] Crear `src/data/titles-04.json`: 10 series t-031…t-040 según la tabla de referencia (con `seasons`).
- [ ] T025 [P] Crear `src/data/titles-05.json`: 10 series t-041…t-050 según la tabla de referencia.
- [ ] T026 [P] Crear `src/data/titles-06.json`: 10 series t-051…t-060 según la tabla de referencia.
- [ ] T027 [P] Crear `src/data/rows.json`: las 11 filas de la tabla de referencia (`id`, `name`, `kind`, `views`, `titleIds`), con las listas de ids expandidas.
- [ ] T028 Crear `src/data/catalog.ts`: importar los 6 `titles-*.json`, `rows.json`, `profiles.json` y `notifications.json`; exportar `titles: Title[]` (concatenados), `rows: Row[]`, `profiles: Profile[]`, `notifications: Notification[]`, `FEATURED_ID = 't-001'` y `getTitle(id: string): Title | undefined`.
- [ ] T029 Crear `src/data/catalog.test.ts`: comprueba 60 títulos con ids únicos; todo `titleIds` de las filas existe; `r-top10` tiene 10 ids y las demás ≥ 6; películas con `durationMinutes`; series con `seasons` no vacío; ≥ 20 títulos con `rating` `TP` o `7+`; 4 perfiles y solo uno `isKids`; 3 notificaciones.
- [ ] T030 [P] Crear `scripts/generate-placeholders.mjs` (Node, ESM, solo `fs` y `path`): lee `src/data/titles-*.json` y `src/data/profiles.json`; por cada título escribe `public/assets/posters/<id>.svg` (300×450) y `public/assets/banners/<id>.svg` (1600×700) con un degradado cuyo color sale de un hash del `id` y el nombre del título centrado; por cada perfil escribe `public/assets/avatars/<id>.svg` (128×128); y escribe `public/assets/placeholder.svg` (300×450, gris con el texto "Sin imagen"), que se usa cuando una imagen falla. Crea las carpetas si no existen.
- [ ] T031 Ejecutar `npm run assets` y comprobar que `public/assets/posters` contiene 60 ficheros y que existe `public/assets/placeholder.svg`. Después, **[MANUAL]** (opcional): sustituir los SVG por arte real con el mismo nombre.

### Contextos y componentes compartidos

- [ ] T032 Crear `src/hooks/useProfile.tsx`: `ProfileProvider` y `useProfile()` → `{ profile: Profile | null; selectProfile(id): void; signOut(): void }`. Lee/escribe `nbc:profile` con `readJson`/`writeJson`; el guard exige un id existente en `profiles`; `signOut` borra la clave y deja `profile = null`.
- [ ] T033 Crear `src/hooks/useProfile.test.tsx`: sin clave → `null`; `selectProfile('p-2')` persiste y devuelve el perfil; clave con id desconocido → `null`; `signOut` limpia.
- [ ] T034 Crear `src/hooks/useMyList.tsx`: `MyListProvider` y `useMyList()` → `{ ids: string[]; has(id): boolean; toggle(id): void }`. Usa el perfil activo y la clave `nbc:my-list:<profileId>` (sin perfil → `nbc:my-list:anon`); sin duplicados; conserva el orden de adición; datos corruptos → `[]`.
- [ ] T035 Crear `src/hooks/useMyList.test.tsx`: alternar añade y quita; persiste tras desmontar y volver a montar; listas separadas por perfil; JSON corrupto → lista vacía.
- [ ] T036 Crear `src/hooks/useTitleModal.tsx`: `TitleModalProvider` y `useTitleModal()` → `{ current: Title | null; open(title: Title): void; close(): void }`. Solo estado; sin interfaz.
- [ ] T037 [P] Crear `src/components/AddToListButton/AddToListButton.tsx` y `AddToListButton.module.css`: props `{ titleId: string; testId?: string }` (por defecto `'add-to-list'`). `<button data-testid={testId} aria-pressed={has}>` muestra `+` o `✓`; `aria-label` = `"Añadir a Mi lista"` o `"Quitar de Mi lista"`; llama a `toggle(titleId)`.
- [ ] T038 Crear `src/components/AddToListButton/AddToListButton.test.tsx`: alterna símbolo y `aria-label`, respeta `testId`, persiste en `localStorage`.

### Estructura de la aplicación

- [ ] T039 Crear `src/app/RootLayout.tsx`: `export default function RootLayout()` que devuelve `<Outlet />` (de `react-router-dom`). Aquí se montará el host del modal.
- [ ] T040 Crear `src/app/routes.tsx`: `export const routes: RouteObject[]` = `[{ element: <RootLayout />, children: [{ path: '/', element: <p>Netflix Browse Clone</p> }] }]`. Las historias añadirán rutas en `children`.
- [ ] T041 Crear `src/app/App.tsx`: `export default function App()` con `<ProfileProvider><MyListProvider><TitleModalProvider><RouterProvider router={router} /></TitleModalProvider></MyListProvider></ProfileProvider>`, donde `router = createBrowserRouter(routes)` se crea fuera del componente.
- [ ] T042 Reescribir `src/main.tsx`: importar `./styles/global.css` y `App` desde `./app/App`; `createRoot(...).render(<StrictMode><App /></StrictMode>)`.
- [ ] T043 Crear `src/test/renderWithProviders.tsx`: `renderWithProviders(ui, { route = '/browse', profileId }?)` que, si hay `profileId`, escribe `nbc:profile` en `localStorage` antes de renderizar y envuelve en `ProfileProvider`, `MyListProvider`, `TitleModalProvider` y `MemoryRouter initialEntries={[route]}`. Devuelve el resultado de `render` de Testing Library.
- [ ] T044 **GATE Foundational**: `npm run typecheck && npm test && npm run build`. Corregir lo que falle.

---

## Phase 3: User Story 1 - Cabecera de navegación (Priority: P1) 🎯 MVP

**Goal**: cabecera fija con logotipo, enlaces (Inicio, Series, Películas, Novedades populares, Mi lista), buscador (inerte hasta US7), notificaciones y menú de perfil.

**Independent Test**: abrir `/browse` y comprobar cabecera transparente → sólida al hacer scroll, menú desplegable en 360 px, panel de 3 avisos y menú de perfil.

**Checkpoint (al terminar)**: `/browse`, `/browse/series`, `/browse/movies` y `/browse/new` muestran la cabecera completa y funcional; el resto de la página está vacío.

- [ ] T045 [P] [US1] Crear `src/hooks/useScrolled.ts`: `useScrolled(threshold = 10): boolean`; escucha `scroll` en `window` (`{ passive: true }`), devuelve `window.scrollY > threshold` y limpia el listener.
- [ ] T046 [P] [US1] Crear `src/components/Header/Header.module.css`: `.header` (`position: fixed; top: 0; width: 100%; height: var(--header-height); z-index: var(--z-header); background: linear-gradient(to bottom, rgba(0,0,0,.7), transparent)`), `.solid` (`background: var(--color-bg)`), `.logo` (rojo, mayúsculas, negrita), `.nav`, `.nav a[aria-current='page']` (negrita), `.menuToggle` (oculto desde 768 px); `@media (max-width: 767px)` oculta `.nav` salvo con `.open`, que se muestra como columna bajo la cabecera.
- [ ] T047 [US1] Crear `src/components/Header/Header.tsx` (sin props): `<a className="skip-link" href="#main">Saltar al contenido</a>`; `<header data-testid="app-header" className={scrolled ? solid : ''}>`; logotipo de texto `NETFLIX`; `<nav id="primary-nav" aria-label="Principal">` con `NavLink`: Inicio `/browse` (`nav-home`, prop `end`), Series `/browse/series` (`nav-series`), Películas `/browse/movies` (`nav-movies`), Novedades populares `/browse/new` (`nav-new`), Mi lista `/my-list` (`nav-my-list`); botón `nav-menu-toggle` (`aria-label="Menú"`, `aria-expanded`, `aria-controls="primary-nav"`) que alterna la clase `open`; botón `search-toggle` (`aria-label="Buscar"`, sin acción todavía). Usa `useScrolled`.
- [ ] T048 [P] [US1] Crear `src/components/NotificationsPanel/NotificationsPanel.tsx` y `.module.css`: props `{ open: boolean; onClose(): void; anchorRef: RefObject<HTMLElement | null> }`. Si `!open` devuelve `null`; si no, `<div role="region" aria-label="Notificaciones" data-testid="notifications-panel">` con `<ul>` de `notifications` (`<li data-testid="notification-item">` con `text` y `date`). Escape (listener en `document`) y `mousedown` fuera del panel y de `anchorRef` llaman a `onClose`.
- [ ] T049 [P] [US1] Crear `src/components/ProfileMenu/ProfileMenu.tsx` y `.module.css` (sin props): botón `profile-menu-toggle` (`aria-haspopup="menu"`, `aria-expanded`, avatar del perfil activo o del primero) que abre `<div role="menu" data-testid="profile-menu">` con un `<button role="menuitem" data-testid="profile-option">` por perfil de `profiles` (llama a `selectProfile(id)`) y `<button role="menuitem" data-testid="sign-out">Cerrar sesión</button>` (llama a `signOut()` y `navigate('/profiles')`). Escape y clic fuera cierran.
- [ ] T050 [US1] Editar `src/components/Header/Header.tsx`: añadir estado `notifOpen`, un `ref` para el botón `notifications-toggle` (`aria-label="Notificaciones"`, `aria-expanded`), renderizar `<NotificationsPanel open onClose anchorRef />` y `<ProfileMenu />` a la derecha.
- [ ] T051 [P] [US1] Crear `src/pages/BrowsePage.tsx`: props `{ view: View }`; devuelve `<><Header /><main id="main" tabIndex={-1}><h1 className="sr-only">{título de la vista}</h1></main></>`. Títulos: home "Inicio", series "Series", movies "Películas", new "Novedades populares".
- [ ] T052 [US1] Editar `src/app/routes.tsx`: en `children`, sustituir la ruta `/` por `{ path: '/', element: <Navigate to="/browse" replace /> }` y añadir `/browse` (`view="home"`), `/browse/series` (`series`), `/browse/movies` (`movies`), `/browse/new` (`new`) con `BrowsePage`, más `{ path: '*', element: <Navigate to="/browse" replace /> }` al final.
- [ ] T053 [US1] Crear `src/components/Header/Header.test.tsx`: enlaces con sus `href` y textos; `notifications-toggle` abre el panel con 3 `notification-item` y Escape lo cierra; `nav-menu-toggle` alterna `aria-expanded`; tras simular `window.scrollY = 50` y un evento `scroll`, el header tiene la clase `solid`; `profile-menu-toggle` abre un menú con 4 `profile-option` y un `sign-out`.
- [ ] T054 **GATE US1**: `npm run typecheck && npm test && npm run build`. Verificar a mano en `npm run dev` que el menú se colapsa a 360 px.

---

## Phase 4: User Story 2 - Título destacado / hero (Priority: P1)

**Goal**: título destacado a ancho completo con vídeo único o banner, sinopsis, etiqueta de edad y botones "Reproducir" y "Más información".

**Independent Test**: cargar `/browse` y comprobar el hero, el degradado y los botones; con movimiento reducido no hay vídeo.

**Checkpoint (al terminar)**: `/browse` muestra el hero del título `t-001`; "Reproducir" navega a `/watch/t-001` (aún sin página) y "Más información" cambia el estado del modal (la interfaz llega en US5).

- [ ] T055 [P] [US2] Crear `src/hooks/useReducedMotion.ts` y `useReducedMotion.test.ts`: `useReducedMotion(): boolean` con `window.matchMedia('(prefers-reduced-motion: reduce)')`, estado inicial desde `matches` y suscripción a `change`. La prueba sustituye `matchMedia` para devolver `matches: true` y comprueba el valor.
- [ ] T056 [P] [US2] Crear `src/components/Hero/Hero.module.css`: `.hero` a ancho completo y altura `min(80vh, 720px)`; `.media` (imagen y vídeo con `object-fit: cover`, `position: absolute; inset: 0`); `.overlay` con degradado `linear-gradient(to right, rgba(0,0,0,.8), transparent 60%), linear-gradient(to top, var(--color-bg), transparent 30%)`; `.content` sobre el degradado con la sinopsis limitada a 3 líneas; `.badge` (borde, texto pequeño); botones `.play` (fondo blanco) y `.more` (fondo gris translúcido).
- [ ] T057 [US2] Crear `src/components/Hero/Hero.tsx`: props `{ title: Title }`. `<section data-testid="hero" aria-label="Título destacado">` con `<img src={title.banner} alt="">` siempre de fondo (con la guarda `onError` de imagen sustituta) y, si `!useReducedMotion()`, `<video src="/assets/video/sample.mp4" autoPlay muted loop playsInline poster={title.banner}>` que se oculta con `onError`; título (`<img alt={name}>` del `logo` o `<h2>{name}</h2>`), `<p>` con la sinopsis, `<span className={badge}>{rating}</span>`, botón `hero-play` "Reproducir" (`navigate('/watch/' + id)`) y botón `hero-more-info` "Más información" (`useTitleModal().open(title)`).
- [ ] T058 [US2] Editar `src/pages/BrowsePage.tsx`: calcular `visible = filterByProfile(titles, profile)` y `featured = visible.find(t => t.id === FEATURED_ID) ?? visible[0]`; si existe, renderizar `<Hero title={featured} />` dentro de `<main>`, justo después del `<h1 className="sr-only">`.
- [ ] T059 [US2] Crear `src/components/Hero/Hero.test.tsx`: muestra nombre, sinopsis y etiqueta de edad; existen `hero-play` y `hero-more-info`; con `matchMedia` de movimiento reducido no hay `<video>`; el clic en `hero-more-info` abre el modal (comprobable con un consumidor de `useTitleModal`).
- [ ] T060 [MANUAL] [US2] Copiar un vídeo corto cualquiera (≤ 15 s) a `public/assets/video/sample.mp4`. Sin él el hero muestra el banner (por `onError`).
- [ ] T061 **GATE US2**: `npm run typecheck && npm test && npm run build`.

---

## Phase 5: User Story 3 - Filas de títulos / carruseles (Priority: P1)

**Goal**: filas por categoría con scroll horizontal paginado (ratón, teclado y táctil), flechas en extremos y fila "Top 10" con números.

**Independent Test**: navegar una fila con las flechas, con teclado y deslizando; comprobar 6/5/4/3/2 tarjetas visibles según el ancho.

**Checkpoint (al terminar)**: `/browse` muestra las 6 filas de `home`; `/browse/series`, `/browse/movies` y `/browse/new` muestran las suyas; cada fila se desplaza por páginas.

- [ ] T062 [US3] Crear `src/hooks/useCarousel.ts` y `useCarousel.test.ts`: `useCarousel(itemCount: number)` → `{ ref, canPrev, canNext, prev, next, perPage }`. `perPage = itemsPerPage(window.innerWidth)` actualizado en `resize`; `prev()`/`next()` llaman a `ref.current.scrollBy({ left: ∓clientWidth, behavior: reduced ? 'auto' : 'smooth' })`; `canPrev = scrollLeft > 0`, `canNext = scrollLeft + clientWidth < scrollWidth - 1`, recalculados en `scroll` y `resize`. La prueba usa un elemento con `scrollLeft`, `clientWidth` y `scrollWidth` simulados.
- [ ] T063 [P] [US3] Crear `src/components/TitleCard/TitleCard.module.css`: `.card` (`flex: 0 0 calc(100% / var(--per-page, 6))`, `padding: 0 4px`, `position: relative`), `.thumb` (relación 16/9, `object-fit: cover`, `border-radius: 4px`), `.poster` (relación 2/3, para Top 10), `.rank` (número grande, contorno, a la izquierda del póster), `:focus-visible` visible.
- [ ] T064 [US3] Crear `src/components/TitleCard/TitleCard.tsx`: props `{ title: Title; rank?: number }`. `<li data-testid="title-card" data-title-id={title.id}>` con un `<button aria-label={title.name}>` que abre el detalle (`useTitleModal().open(title)`) y contiene `<img loading="lazy">` con `width`/`height` y la guarda `onError` de imagen sustituta: el `banner` (320×180) o, si hay `rank`, el `poster` (200×300) junto a `<span data-testid="top10-rank" aria-hidden="true">{rank}</span>`.
- [ ] T065 [P] [US3] Crear `src/components/Row/Row.module.css`: `.row` con margen; `.list` (`display: flex; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; list-style: none; padding: var(--preview-space-top) var(--preview-space-inline) var(--preview-space-bottom); margin: calc(-1 * var(--preview-space-top)) calc(-1 * var(--preview-space-inline)) calc(-1 * var(--preview-space-bottom)); scroll-padding-inline: var(--preview-space-inline)`; el relleno reserva sitio para la previsualización dentro del contenedor con scroll, que recorta lo que sobresale, y el margen negativo evita que cambie el diseño), `.list > li { scroll-snap-align: start }`; `.arrow` (posición absoluta a cada lado, `opacity: 0`, visible con `.row:hover .arrow` y `.arrow:focus-visible`), `.arrow:disabled` oculta; `.row:is(:hover, :focus-within) { position: relative; z-index: var(--z-preview) }` para que la previsualización quede por encima de la fila siguiente.
- [ ] T066 [US3] Crear `src/components/Row/Row.tsx`: props `{ row: Row; titles: Title[] }` (importar el tipo con alias para no chocar con el componente). Si `titles.length === 0` devuelve `null`. `<section data-testid="row" aria-labelledby={`${row.id}-title`}>` con `<h2 id data-testid="row-title">{row.name}</h2>`, botones `row-prev` (`aria-label="Anterior"`) y `row-next` (`aria-label="Siguiente"`) con `disabled={!canPrev}`/`{!canNext}`, y `<ul ref style={{ '--per-page': perPage }}>` con un `TitleCard` por título (pasando `rank={index + 1}` solo si `row.kind === 'top10'`). `onKeyDown` en el `<ul>`: `ArrowRight` → `next()`, `ArrowLeft` → `prev()`.
- [ ] T067 [US3] Editar `src/pages/BrowsePage.tsx`: tras el hero, `rowsForView(rows, view).map(row => ({ row, titles: row.titleIds.map(getTitle).filter(Boolean) }))`, aplicar `filterByProfile` a los títulos de cada fila y renderizar un `<Row key={row.id} row titles />` por fila con títulos. Si tras filtrar no queda ninguna fila, renderizar `<p data-testid="browse-empty">No hay contenido disponible en esta vista.</p>`.
- [ ] T068 [US3] Crear `src/components/Row/Row.test.tsx`: con una fila de 12 títulos, hay 12 `title-card`; `row-prev` está deshabilitado al inicio; la fila `top10` muestra `top10-rank` con los números 1…10; una fila vacía no renderiza `row`; `ArrowRight` en la lista invoca el avance (espiando `scrollBy`).
- [ ] T069 **GATE US3**: `npm run typecheck && npm test && npm run build`. Verificar a mano 6/5/4/3/2 tarjetas redimensionando la ventana.

---

## Phase 6: User Story 4 - Tarjeta con previsualización (Priority: P1)

**Goal**: al pasar el ratón o enfocar, la tarjeta se amplía mostrando acciones, duración o temporadas, edad y géneros, sin desplazar la fila; en táctil, un toque abre el detalle.

**Independent Test**: pasar el ratón sobre una tarjeta, esperar ~400 ms, comprobar la ampliación; Escape cierra.

**Checkpoint (al terminar)**: las tarjetas muestran la previsualización con retardo; la fila no se mueve; en dispositivos sin hover no aparece.

- [ ] T070 [US4] Crear `src/hooks/useHoverPreview.ts` y `useHoverPreview.test.ts`: `useHoverPreview(delayMs = 400)` → `{ open: boolean; handlers: { onMouseEnter, onMouseLeave, onFocus, onBlur, onKeyDown }; close(): void }`. `onMouseEnter`/`onFocus` abren tras `delayMs`; `onMouseLeave`/`onBlur` cancelan y cierran; `onKeyDown` con `Escape` cierra; si `matchMedia('(hover: none)').matches`, nunca abre. La prueba usa `vi.useFakeTimers()`.
- [ ] T071 [P] [US4] Crear `src/components/TitleCard/CardPreview.module.css`: `.preview` (`position: absolute; top: -16px; left: -12%; width: 124%; z-index: var(--z-preview); background: var(--color-surface); border-radius: 6px; box-shadow: 0 8px 24px rgba(0,0,0,.6)`), `.actions` (fila de botones circulares), `.meta` (edad, duración, géneros).
- [ ] T072 [US4] Crear `src/components/TitleCard/CardPreview.tsx`: props `{ title: Title; onOpenDetail(): void }`. `<div data-testid="card-preview" role="group" aria-label={title.name}>` con `<img loading="lazy">` del banner (con la guarda `onError` de imagen sustituta); botones `preview-play` (`aria-label="Reproducir"`, `navigate('/watch/' + id)`), `<AddToListButton titleId testId="preview-add" />`, `preview-like` (`aria-label="Me gusta"`, `aria-pressed`, estado local) y `preview-more` (`aria-label="Más información"`, llama a `onOpenDetail`); texto `rating`, `formatDuration(durationMinutes)` o `${n} temporadas`, y los géneros unidos con ` • `.
- [ ] T073 [US4] Editar `src/components/TitleCard/TitleCard.tsx`: usar `useHoverPreview()`; aplicar sus `handlers` al `<li>`; si `open` y no hay `rank`, renderizar `<CardPreview title onOpenDetail={() => { close(); openModal(title) }} />` dentro del `<li>`.
- [ ] T074 [US4] Crear `src/components/TitleCard/TitleCard.test.tsx` (con `vi.useFakeTimers()`): tras `mouseEnter` y 400 ms aparece `card-preview` con los 4 botones; `Escape` lo cierra; `mouseLeave` lo cierra; con `matchMedia('(hover: none)')` simulado a `matches: true` no aparece; el clic en la tarjeta abre el modal.
- [ ] T075 **GATE US4**: `npm run typecheck && npm test && npm run build`.

---

## Phase 7: User Story 5 - Detalle de título (Priority: P2)

**Goal**: modal accesible con sinopsis, reparto, géneros, año, duración, temporadas y episodios, y títulos similares.

**Independent Test**: abrir el detalle de una película y de una serie desde el hero y desde una tarjeta; Escape cierra y devuelve el foco.

**Checkpoint (al terminar)**: "Más información" y el clic en una tarjeta abren el detalle; el foco queda atrapado y se restaura.

- [ ] T076 [P] [US5] Crear `src/hooks/useFocusTrap.ts` y `useFocusTrap.test.tsx`: `useFocusTrap(active: boolean): RefObject<HTMLElement | null>`; mientras `active`, `Tab` en el último focusable vuelve al primero y `Shift+Tab` en el primero va al último (selector de focusables estándar: `a[href], button:not(:disabled), input, select, textarea, [tabindex]:not([tabindex="-1"])`).
- [ ] T077 [P] [US5] Crear `src/lib/similarTitles.ts` y `similarTitles.test.ts`: `similarTitles(title, all, limit = 6)` excluye el propio título, conserva los que comparten ≥ 1 género, ordena por nº de géneros compartidos descendente y luego por `name`, y recorta a `limit`.
- [ ] T078 [P] [US5] Crear `src/components/Modal/Modal.module.css`: `.backdrop` (`position: fixed; inset: 0; background: rgba(0,0,0,.7); z-index: var(--z-modal); display: flex; justify-content: center; overflow-y: auto`), `.dialog` (ancho `min(850px, 100%)`, fondo `var(--color-surface)`, margen superior, esquinas redondeadas).
- [ ] T079 [US5] Crear `src/components/Modal/Modal.tsx`: props `{ labelledBy: string; onClose(): void; children: ReactNode }`. Portal a `document.body`; `<div className={backdrop} onMouseDown={cierra si target === currentTarget}>` y `<div data-testid="modal-dialog" role="dialog" aria-modal="true" aria-labelledby={labelledBy} ref={useFocusTrap(true)} tabIndex={-1}>`; al montar guarda `document.activeElement`, enfoca el diálogo y fija `body.style.overflow = 'hidden'`; `Escape` llama a `onClose`; al desmontar restaura el overflow y devuelve el foco al elemento guardado.
- [ ] T080 [US5] Crear `src/components/Modal/Modal.test.tsx`: `modal-dialog` existe y tiene los atributos `role="dialog"`, `aria-modal="true"` y `aria-labelledby` (comprobados con `toHaveAttribute`); Escape y el clic en el fondo llaman a `onClose`; al desmontar el foco vuelve al botón que lo abrió; Tab y Shift+Tab permanecen dentro.
- [ ] T081 [P] [US5] Crear `src/components/TitleModal/TitleModal.module.css`: cabecera con banner y degradado, `.close` (botón arriba a la derecha), `.meta`, `.episodes` (lista), `.similar` (cuadrícula de 3 columnas, 2 en móvil).
- [ ] T082 [US5] Crear `src/components/TitleModal/TitleModal.tsx`: props `{ title: Title; onClose(): void }`. `<Modal labelledBy="title-modal-heading" onClose>` con `<div data-testid="title-modal">`: banner (con la guarda `onError`), `<h2 id="title-modal-heading">{name}</h2>`, botón `modal-close` (`aria-label="Cerrar"`), botón "Reproducir" (`navigate('/watch/' + id)` y cierra), `<AddToListButton titleId />`, año, `rating`, duración o nº de temporadas, géneros, reparto y sinopsis. Si `type === 'series'`: `<select data-testid="season-select" aria-label="Temporada">` y `<li data-testid="episode-item">` por episodio de la temporada elegida (sin episodios → "Sin episodios"). Sección "Títulos similares": `similarTitles(title, filterByProfile(titles, profile))` como `<button data-testid="similar-title">` que llama a `useTitleModal().open(similar)`.
- [ ] T083 [P] [US5] Crear `src/components/TitleModal/TitleModalHost.tsx`: `const { current, close } = useTitleModal(); return current ? <TitleModal title={current} onClose={close} /> : null`.
- [ ] T084 [US5] Editar `src/app/RootLayout.tsx`: renderizar `<Outlet />` y a continuación `<TitleModalHost />`.
- [ ] T085 [US5] Crear `src/components/TitleModal/TitleModal.test.tsx`: película → muestra duración y sin `season-select`; serie → `season-select` y `episode-item` y cambiar de temporada actualiza la lista; Escape y `modal-close` cierran y el foco vuelve al botón de origen; `similar-title` abre otro título.
- [ ] T086 **GATE US5**: `npm run typecheck && npm test && npm run build`.

---

## Phase 8: User Story 6 - Mi lista (Priority: P2)

**Goal**: ver los títulos guardados en una cuadrícula, con mensaje cuando está vacía.

**Independent Test**: añadir y quitar un título, recargar y abrir "Mi lista".

**Checkpoint (al terminar)**: `/my-list` muestra los títulos guardados del perfil activo o el mensaje de lista vacía; persiste tras recargar.

- [ ] T087 [P] [US6] Crear `src/components/TitleGrid/TitleGrid.tsx` y `TitleGrid.module.css`: props `{ titles: Title[] }`; `<ul>` con `display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 12px; list-style: none` y un `<TitleCard title />` por título.
- [ ] T088 [US6] Crear `src/pages/MyListPage.tsx`: `<Header />` y `<main id="main" tabIndex={-1} style={{ paddingTop: 'var(--header-height)' }}>` con `<h1>Mi lista</h1>`; títulos = `ids.map(getTitle)` filtrados por `filterByProfile`; si no hay → `<p data-testid="my-list-empty">Tu lista está vacía. Añade títulos con el botón +.</p>`; si hay → `<TitleGrid titles />`.
- [ ] T089 [US6] Editar `src/app/routes.tsx`: añadir `{ path: '/my-list', element: <MyListPage /> }` antes de la ruta `*`.
- [ ] T090 [US6] Crear `src/pages/MyListPage.test.tsx`: vacío → `my-list-empty`; con `nbc:my-list:p-1` precargado en `localStorage` y `profileId: 'p-1'` → muestra esos títulos; quitar uno lo elimina; con perfil Infantil se ocultan los de clasificación no apta.
- [ ] T091 **GATE US6**: `npm run typecheck && npm test && npm run build`.

---

## Phase 9: User Story 7 - Búsqueda (Priority: P2)

**Goal**: buscar por título, género o actor con resultados en cuadrícula, mensaje sin resultados y vuelta al inicio al vaciar.

**Independent Test**: expandir la lupa, escribir, ver resultados o el mensaje, vaciar el campo.

**Checkpoint (al terminar)**: la lupa expande el buscador y `/search?q=…` muestra los resultados; vaciar vuelve a `/browse`.

- [ ] T092 [P] [US7] Crear `src/hooks/useDebouncedValue.ts` y `useDebouncedValue.test.ts`: `useDebouncedValue<T>(value: T, delayMs: number): T`; la prueba con `vi.useFakeTimers()` comprueba que el valor solo cambia tras `delayMs`.
- [ ] T093 [P] [US7] Crear `src/components/SearchBox/SearchBox.module.css`: contenedor flex; `.input` oculto (`width: 0`) y expandido con `.open` (`width: 220px`, transición); borde visible al enfocar.
- [ ] T094 [US7] Crear `src/components/SearchBox/SearchBox.tsx` (sin props): estado `open` y `text` (inicial: `q` de la URL); botón `search-toggle` (`aria-label="Buscar"`, `aria-expanded`) que abre y enfoca `<input data-testid="search-input" aria-label="Buscar títulos, géneros o actores">`; con `useDebouncedValue(text, 250)`: si hay texto → `navigate('/search?q=' + encodeURIComponent(v), { replace: true })`; si se vacía estando en `/search` → `navigate('/browse')`. `Escape` vacía y cierra.
- [ ] T095 [US7] Editar `src/components/Header/Header.tsx`: sustituir el botón inerte `search-toggle` por `<SearchBox />`.
- [ ] T096 [US7] Crear `src/pages/SearchPage.tsx`: `<Header />` y `<main id="main" tabIndex={-1}>`; `q` de `useSearchParams`; si `q.trim() === ''` → `<Navigate to="/browse" replace />`; `results = searchTitles(q, filterByProfile(titles, profile))`; sin resultados → `<p data-testid="search-empty">No hay resultados para «{q}».</p>`; con resultados → `<div data-testid="search-results"><TitleGrid titles={results} /></div>`.
- [ ] T097 [US7] Editar `src/app/routes.tsx`: añadir `{ path: '/search', element: <SearchPage /> }` antes de `*`.
- [ ] T098 [US7] Crear `src/components/SearchBox/SearchBox.test.tsx` (fake timers): abrir la lupa muestra `search-input`; escribir navega a `/search?q=…` tras 250 ms; vaciar vuelve a `/browse`; `Escape` cierra.
- [ ] T099 [US7] Crear `src/pages/SearchPage.test.tsx`: busca por título, por género y por actor y muestra `search-results`; texto sin coincidencias → `search-empty`; `q` vacía redirige.
- [ ] T100 **GATE US7**: `npm run typecheck && npm test && npm run build`.

---

## Phase 10: User Story 8 - Selección de perfil (Priority: P3)

**Goal**: pantalla "¿Quién está viendo ahora?" con 4 perfiles, el perfil elegido se recuerda y el Infantil solo ve contenido `TP` y `7+`.

**Independent Test**: elegir cada perfil, comprobar el catálogo del Infantil, recargar y ver que se recuerda.

**Checkpoint (al terminar)**: `/` redirige a `/profiles` sin perfil y a `/browse` con perfil; las rutas protegidas exigen perfil; "Cerrar sesión" vuelve a `/profiles`.

- [ ] T101 [P] [US8] Crear `src/components/ProfileGate/ProfileGate.tsx` y `ProfileGate.module.css`: `<h1>¿Quién está viendo ahora?</h1>` y 4 `<button data-testid="profile-card">` (avatar `<img alt="">` con `width`/`height` 128 y nombre; el Infantil indica "Infantil") que llaman a `selectProfile(id)` y `navigate('/browse')`.
- [ ] T102 [P] [US8] Crear `src/pages/ProfilesPage.tsx`: `<main id="main">` con `<ProfileGate />`.
- [ ] T103 [P] [US8] Crear `src/app/RequireProfile.tsx`: `const { profile } = useProfile(); return profile ? <Outlet /> : <Navigate to="/profiles" replace />`.
- [ ] T104 [P] [US8] Crear `src/app/HomeRedirect.tsx`: `const { profile } = useProfile(); return <Navigate to={profile ? '/browse' : '/profiles'} replace />`.
- [ ] T105 [US8] Editar `src/app/routes.tsx`: `/` → `<HomeRedirect />`; añadir `/profiles` (público) y agrupar `/browse*`, `/my-list`, `/search` (y más adelante `/watch/:id`) bajo `{ element: <RequireProfile />, children: [...] }`; la ruta `*` pasa a `<Navigate to="/" replace />`.
- [ ] T106 [US8] Crear `src/components/ProfileGate/ProfileGate.test.tsx`: se muestran 4 `profile-card`; pulsar uno persiste `nbc:profile` y navega a `/browse`; con `nbc:profile` preexistente, `/` redirige a `/browse`; sin perfil, `/browse` redirige a `/profiles`.
- [ ] T107 [US8] Crear `src/pages/BrowsePage.kids.test.tsx`: con `profileId: 'p-4'`, todo `title-card` renderizado tiene un `data-title-id` cuyo título es `TP` o `7+`; con `p-1` aparecen también títulos de otras clasificaciones; con `p-4` en `/browse/new`, `/browse/series` y `/browse/movies` hay al menos una fila (no aparece `browse-empty`).
- [ ] T108 **GATE US8**: `npm run typecheck && npm test && npm run build`.

---

## Phase 11: User Story 9 - Reproductor simulado (Priority: P3)

**Goal**: vista de reproducción con el vídeo de muestra, controles y atajos de teclado.

**Independent Test**: pulsar "Reproducir" en cualquier título y usar cada control y tecla.

**Checkpoint (al terminar)**: `/watch/:id` reproduce el clip único con controles propios y atajos; un id inexistente redirige a `/browse`.

- [ ] T109 [P] [US9] Crear `src/hooks/usePlayerShortcuts.ts` y `usePlayerShortcuts.test.tsx`: `usePlayerShortcuts({ togglePlay, seek, toggleFullscreen, toggleMute, exit })` registra `keydown` en `window`: Espacio → `togglePlay()` (con `preventDefault`), `ArrowLeft` → `seek(-5)`, `ArrowRight` → `seek(5)`, `f`/`F` → `toggleFullscreen()`, `m`/`M` → `toggleMute()`, `Escape` → `exit()`; ignora eventos cuyo `target` sea `input`, `select` o `textarea`.
- [ ] T110 [P] [US9] Crear `src/components/Player/Player.module.css`: contenedor a pantalla completa con fondo negro, `<video>` ajustado (`object-fit: contain`), barra de controles inferior sobre degradado, `input[type=range]` con ancho flexible.
- [ ] T111 [US9] Crear `src/components/Player/Player.tsx`: props `{ title: Title }`. `<div data-testid="player" ref>` con `<video src="/assets/video/sample.mp4" autoPlay playsInline>` y controles: `player-play` (alterna reproducir/pausar; `aria-label` "Pausar" o "Reproducir"), `player-volume` (`<input type="range" min=0 max=1 step=0.05 aria-label="Volumen">`, valor inicial de `nbc:volume`, lo guarda al cambiar), `player-progress` (`<input type="range" aria-label="Progreso">` que sigue `timeupdate` y busca con `onChange`), `player-fullscreen` (`aria-label="Pantalla completa"`, `requestFullscreen` sobre el contenedor) y `player-back` (`aria-label="Volver"`, `navigate(-1)`); muestra `title.name`. Usa `usePlayerShortcuts`.
- [ ] T112 [P] [US9] Crear `src/pages/WatchPage.tsx` (export `default`): `const { id } = useParams()`; `getTitle(id ?? '')`; si no existe → `<Navigate to="/browse" replace />`; si existe → `<Player title />`.
- [ ] T113 [US9] Editar `src/app/routes.tsx`: añadir, dentro del grupo protegido, `{ path: '/watch/:id', lazy: () => import('../pages/WatchPage').then(m => ({ Component: m.default })) }`.
- [ ] T114 [US9] Crear `src/components/Player/Player.test.tsx`: existen `player-play`, `player-volume`, `player-progress`, `player-fullscreen` y `player-back`; el botón de reproducir alterna su `aria-label`; el volumen se guarda en `nbc:volume`; la tecla Espacio alterna la reproducción; `player-back` navega atrás.
- [ ] T115 **GATE US9**: `npm run typecheck && npm test && npm run build`.

---

## Phase 12: Polish & Cross-Cutting Concerns

**Checkpoint (al terminar)**: la aplicación cumple la constitución y los criterios de éxito: `lint`, `typecheck`, `test` y `build` en verde y comprobaciones manuales hechas.

- [ ] T116 [P] Reescribir `README.md`: descripción de la demo, requisitos (Node ≥ 20), scripts (`dev`, `build`, `preview`, `test`, `typecheck`, `lint`, `assets`), estructura de carpetas y nota de que los activos de `public/assets` pueden sustituirse por arte real.
- [ ] T117 Ejecutar `npm run lint` y corregir los avisos de ESLint en los ficheros señalados (sin cambiar el comportamiento).
- [ ] T118 [P] Ejecutar `grep -rn "<img" src | grep -v 'loading="lazy"'` y confirmar que solo quedan las imágenes del hero; añadir `loading="lazy"` y `width`/`height` donde falten.
- [ ] T119 [P] Ejecutar `grep -rnE "\bany\b" src --include=*.ts --include=*.tsx` y justificar con comentario o eliminar cada `any` (constitución II).
- [ ] T120 [MANUAL] Comprobar contraste ≥ 4,5:1 de texto y controles sobre los tokens de `tokens.css` (herramienta de contraste del navegador).
- [ ] T121 [MANUAL] Recorrer toda la aplicación **solo con teclado** (Tab, Shift+Tab, Enter, Espacio, flechas, Escape) y confirmar foco visible y sin atrapar el foco fuera de los modales (SC-002).
- [ ] T122 [MANUAL] Comprobar sin scroll horizontal de página a 360, 768, 1280 y 1920 px (SC-003).
- [ ] T123 [MANUAL] Activar "Reducir movimiento" en el sistema y confirmar que el hero no reproduce vídeo y que no hay animaciones esenciales (SC-008).
- [ ] T124 [MANUAL] Recorrer la tabla "Comprobación manual por historia" de `quickstart.md` marcando cada historia US1…US9.
- [ ] T125 **GATE FINAL**: `npm run lint && npm run typecheck && npm test && npm run build`. Corregir lo que falle.

---

## Dependencies & Execution Order

### Orden de fases

1. **Phase 1 Setup** → 2. **Phase 2 Foundational** (bloquea todo) → historias en orden de prioridad → **Phase 12 Polish**.
2. Orden de historias: **US1 → US2 → US3 → US4 → US5 → US6 → US7 → US8 → US9**.

### Dependencias entre historias

| Historia | Depende de | Motivo |
|---|---|---|
| US1 Cabecera | Foundational | Usa perfiles, notificaciones y rutas. |
| US2 Hero | US1 | Se monta en `BrowsePage`; abre el modal por contexto (la interfaz llega en US5). |
| US3 Filas | US1 | Se monta en `BrowsePage`; `TitleCard` abre el modal por contexto. |
| US4 Tarjeta | US3 | Amplía `TitleCard`; usa `AddToListButton` (Foundational). |
| US5 Detalle | Foundational, US3 | Muestra la interfaz del modal; reutiliza `TitleCard` y los contextos. |
| US6 Mi lista | US1, US3 | Reutiliza `Header`, `TitleCard` y `useMyList`. |
| US7 Búsqueda | US1, US6 | Sustituye el botón de la cabecera; reutiliza `TitleGrid` (creado en US6). |
| US8 Perfiles | US1 | Añade guardas de ruta y la pantalla de selección. |
| US9 Reproductor | Foundational | Independiente de las demás salvo por la ruta y `getTitle`. |

### Dentro de cada historia

- El orden de las tareas es el de la lista (CSS y hooks `[P]` antes del componente que los usa; ediciones de `BrowsePage.tsx` y `routes.tsx` en serie).
- `src/app/routes.tsx`, `src/pages/BrowsePage.tsx` y `src/components/Header/Header.tsx` se editan en varias historias: **nunca en paralelo**.

## Parallel Opportunities

- **Setup**: T007, T008 y T009 a la vez.
- **Foundational**: T013–T018 (lógica pura), T019–T027 (datos) y T030 son todos independientes entre sí.
- **US1**: T045, T046, T048, T049 y T051 a la vez; T047 y T050 en serie.
- **US3**: T063 y T065 a la vez.
- **US5**: T076, T077, T078 y T081 a la vez.
- **US8**: T101, T102, T103 y T104 a la vez.
- **US9**: T109, T110 y T112 a la vez.

## Implementation Strategy

### MVP primero

1. Completar Setup y Foundational.
2. Completar US1 → US2 → US3 → US4 (las cuatro P1): ya es un `/browse` reconocible. **Parar y validar** (punto de corte para la demo en directo).
3. Seguir con P2 (US5, US6, US7) y P3 (US8, US9).

### Entrega incremental

- Cada GATE debe quedar en verde antes de la siguiente historia (constitución VI).
- Haz un commit al terminar cada historia: `feat(usN): …`.

## Trazabilidad

| Historia | Requisitos cubiertos |
|---|---|
| US1 | FR-001, FR-002, FR-003, FR-004, FR-026, FR-027 |
| US2 | FR-005, FR-006, FR-007 |
| US3 | FR-008, FR-009, FR-010 |
| US4 | FR-011, FR-012 |
| US5 | FR-013, FR-014, FR-015 |
| US6 | FR-016, FR-017 |
| US7 | FR-018, FR-019 |
| US8 | FR-020, FR-021 |
| US9 | FR-022, FR-023 |
| Transversal | FR-024, FR-025, SC-001…SC-008 (Foundational y Polish) |
