# P05 · US1 Cabecera de navegación (T050–T059)

**Objetivo**: cabecera fija con logotipo, enlaces, notificaciones y menú de perfil (la búsqueda llega en P11).
**Requisito previo**: P04 en verde.
**Salida**: `/browse`, `/browse/series`, `/browse/movies`, `/browse/new` muestran la cabecera completa; el resto de la página está vacío.

## Test IDs de esta fase
`app-header`, `nav-home`, `nav-series`, `nav-movies`, `nav-new`, `nav-my-list`, `nav-menu-toggle`, `search-toggle`, `notifications-toggle`, `notifications-panel`, `notification-item`, `profile-menu-toggle`, `profile-menu`, `profile-option`, `sign-out`.

## T050 · `useScrolled` [P]
- **Crea**: `src/hooks/useScrolled.ts`.
- **Firma**: `export function useScrolled(threshold = 10): boolean`.
- **Reglas**: escucha `scroll` en `window` con `{ passive: true }`; devuelve `window.scrollY > threshold`; limpia el listener al desmontar.

## T051 · `Header.module.css` [P]
- **Crea**: `src/components/Header/Header.module.css`. Clases:

| Clase | Estilo |
|---|---|
| `.header` | `position: fixed; top: 0; width: 100%; height: var(--header-height); z-index: var(--z-header); display: flex; align-items: center; gap: var(--space-3); padding: 0 var(--space-4); background: linear-gradient(to bottom, rgba(0,0,0,.7), transparent)` |
| `.solid` | `background: var(--color-bg)` |
| `.logo` | rojo `var(--color-accent)`, mayúsculas, negrita |
| `.nav` | lista horizontal con huecos |
| `.nav a[aria-current='page']` | negrita |
| `.menuToggle` | oculto a partir de 768 px |
| `.right` | `margin-left: auto; display: flex; gap: var(--space-2)` |
| `@media (max-width: 767px)` | `.nav` oculto salvo `.open`: columna bajo la cabecera, fondo `var(--color-bg)` |

## T052 · `Header.tsx` (primera versión)
- **Crea**: `src/components/Header/Header.tsx`. `export default function Header()`, sin props.
- **Estructura**:
  1. `<a className="skip-link" href="#main">Saltar al contenido</a>`
  2. `<header data-testid="app-header" className={…}>` con `styles.header` y, si `useScrolled()`, `styles.solid`.
  3. Logotipo de texto `NETFLIX` (clase `styles.logo`).
  4. `<nav id="primary-nav" aria-label="Principal">` con `NavLink`:

| Texto | Ruta | `data-testid` | Nota |
|---|---|---|---|
| Inicio | `/browse` | `nav-home` | con `end` |
| Series | `/browse/series` | `nav-series` | |
| Películas | `/browse/movies` | `nav-movies` | |
| Novedades populares | `/browse/new` | `nav-new` | |
| Mi lista | `/my-list` | `nav-my-list` | |

  5. `<button data-testid="nav-menu-toggle" aria-label="Menú" aria-expanded={open} aria-controls="primary-nav">`: alterna la clase `open` del `<nav>`.
  6. `<button data-testid="search-toggle" aria-label="Buscar">` (sin acción todavía).

## T053 · `NotificationsPanel` [P]
- **Crea**: `src/components/NotificationsPanel/NotificationsPanel.tsx` y `.module.css`.
- **Props**: `{ open: boolean; onClose(): void; anchorRef: RefObject<HTMLElement | null> }`.
- **Render**: si `!open` → `null`. Si no: `<div role="region" aria-label="Notificaciones" data-testid="notifications-panel">` con `<ul>` de `notifications` (`src/data/catalog.ts`); cada `<li data-testid="notification-item">` muestra `text` y `date`.
- **Cierre**: `Escape` (listener en `document`) y `mousedown` fuera del panel **y** fuera de `anchorRef.current` llaman a `onClose`.

## T054 · `ProfileMenu` [P]
- **Crea**: `src/components/ProfileMenu/ProfileMenu.tsx` y `.module.css`. Sin props.
- **Render**:
  - `<button data-testid="profile-menu-toggle" aria-haspopup="menu" aria-expanded={open}>` con el avatar (`SafeImage` 32×32, `alt=""`) del perfil activo o del primero.
  - Abierto: `<div role="menu" data-testid="profile-menu">` con un `<button role="menuitem" data-testid="profile-option">` por perfil de `profiles` (llama a `selectProfile(id)` y cierra) y `<button role="menuitem" data-testid="sign-out">Cerrar sesión</button>` (llama a `signOut()` y `navigate('/profiles')`).
- Escape y clic fuera cierran.

## T055 · `Header.tsx` (añadir panel y menú)
- **Edita**: `src/components/Header/Header.tsx`.
- **Añade** a la derecha (contenedor `.right`): estado `notifOpen`; `ref` en `<button data-testid="notifications-toggle" aria-label="Notificaciones" aria-expanded={notifOpen}>`; `<NotificationsPanel open={notifOpen} onClose anchorRef />`; `<ProfileMenu />`.

## T056 · `BrowsePage` (esqueleto) [P]
- **Crea**: `src/pages/BrowsePage.tsx`. `export default function BrowsePage({ view }: { view: View })`.
- **Render**: `<><Header /><main id="main" tabIndex={-1}><h1 className="sr-only">{título}</h1></main></>`.
- **Títulos**: `home` → "Inicio", `series` → "Series", `movies` → "Películas", `new` → "Novedades populares".

## T057 · Rutas de navegación
- **Edita**: `src/app/routes.tsx`. En `children`:
  - `/` → `<Navigate to="/browse" replace />`
  - `/browse` (`view="home"`), `/browse/series` (`series`), `/browse/movies` (`movies`), `/browse/new` (`new`) con `BrowsePage`
  - al final: `{ path: '*', element: <Navigate to="/browse" replace /> }`

## T058 · `Header.test.tsx`
- **Crea**: `src/components/Header/Header.test.tsx`.
- **Casos**:
  1. los 5 enlaces tienen su `href` y texto;
  2. `notifications-toggle` abre el panel con 3 `notification-item` y `Escape` lo cierra;
  3. `nav-menu-toggle` alterna `aria-expanded`;
  4. tras `window.scrollY = 50` + `fireEvent.scroll(window)`, el `app-header` tiene una clase que contiene `solid`;
  5. `profile-menu-toggle` abre un menú con 4 `profile-option` y un `sign-out`.

## T059 · GATE US1
- **Ejecuta**: `npm run typecheck && npm test && npm run build`. Comprueba a mano en `npm run dev` que a 360 px los enlaces se agrupan en el menú.
- Commit: `feat(P05): cabecera`.
