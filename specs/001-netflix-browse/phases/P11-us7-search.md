# P11 · US7 Búsqueda (T096–T104)

**Objetivo**: la lupa expande el buscador; `/search?q=…` muestra resultados o mensaje; vaciar vuelve a `/browse`.
**Requisito previo**: P10 en verde. Usa `searchTitles`, `filterByProfile`, `TitleGrid`, `Header`.

## Test IDs de esta fase
`search-toggle`, `search-input`, `search-results`, `search-empty`.

## T096 · `useDebouncedValue` [P]
- **Crea**: `src/hooks/useDebouncedValue.ts` y `useDebouncedValue.test.ts`.
- **Firma**: `export function useDebouncedValue<T>(value: T, delayMs: number): T`.
- **Prueba**: con `vi.useFakeTimers()`, el valor solo cambia tras `delayMs`.

## T097 · `SearchBox.module.css` [P]
- **Crea**: `src/components/SearchBox/SearchBox.module.css`. Clases: `.box` (flex, centrado), `.input` (`width: 0; opacity: 0; transition: width .2s`), `.open` (`width: 220px; opacity: 1; border: 1px solid var(--color-text)`).

## T098 · `SearchBox.tsx`
- **Crea**: `src/components/SearchBox/SearchBox.tsx`. Sin props.
- **Estado**: `open` (inicial: `true` si hay `q` en la URL), `text` (inicial: `q` de `useSearchParams`).
- **Render**: `<button data-testid="search-toggle" aria-label="Buscar" aria-expanded={open}>` que abre y enfoca; `<input data-testid="search-input" aria-label="Buscar títulos, géneros o actores" value={text} onChange className={open ? styles.open : styles.input}>`.
- **Navegación**: con `const debounced = useDebouncedValue(text, 250)`: si `debounced.trim()` tiene texto → `navigate('/search?q=' + encodeURIComponent(debounced), { replace: true })`; si se vacía y la ruta actual es `/search` → `navigate('/browse')`. `Escape` vacía el texto y cierra.

## T099 · `Header.tsx` con buscador
- **Edita**: `src/components/Header/Header.tsx`: sustituye el botón inerte `search-toggle` por `<SearchBox />`.

## T100 · `SearchPage`
- **Crea**: `src/pages/SearchPage.tsx`. `export default function SearchPage()`.
- **Render**: `<Header />` y `<main id="main" tabIndex={-1} style={{ paddingTop: 'var(--header-height)' }}>`.
- **Lógica**: `const q = useSearchParams()[0].get('q') ?? ''`; si `q.trim() === ''` → `<Navigate to="/browse" replace />`; `results = searchTitles(q, filterByProfile(titles, profile))`. Sin resultados → `<p data-testid="search-empty">No hay resultados para «{q}».</p>`; con resultados → `<div data-testid="search-results"><TitleGrid titles={results} /></div>`.

## T101 · Ruta `/search`
- **Edita**: `src/app/routes.tsx`: añade `{ path: '/search', element: <SearchPage /> }` antes de `*`.

## T102 · `SearchBox.test.tsx`
- **Crea**: `src/components/SearchBox/SearchBox.test.tsx` (fake timers; `userEvent.setup({ advanceTimers: vi.advanceTimersByTime })`).
- **Casos**: pulsar `search-toggle` muestra `search-input` enfocado; escribir navega a `/search?q=…` tras 250 ms; vaciar vuelve a `/browse`; `Escape` cierra. Para comprobar la ruta renderiza un `<LocationDisplay />` auxiliar con `useLocation()` en `data-testid="location"`.

## T103 · `SearchPage.test.tsx`
- **Crea**: `src/pages/SearchPage.test.tsx` con `route: '/search?q=…'`.
- **Casos**: busca por nombre, por género y por actor (usa un nombre real de `src/data/titles-01.json`) y muestra `search-results`; texto sin coincidencias → `search-empty`; `q` vacía redirige (el `<h1>` de `MyListPage` no está; usa `LocationDisplay`).

## T104 · GATE US7
- **Ejecuta**: `npm run typecheck && npm test && npm run build`. Commit: `feat(P11): búsqueda`.
