# P10 · US6 Mi lista (T091–T095)

**Objetivo**: ver los títulos guardados en una cuadrícula, con mensaje cuando la lista está vacía.
**Requisito previo**: P09 en verde. Usa `useMyList`, `getTitle`, `filterByProfile`, `TitleCard`, `Header`.

## Test IDs de esta fase
`my-list-empty`.

## T091 · `TitleGrid` [P]
- **Crea**: `src/components/TitleGrid/TitleGrid.tsx` y `TitleGrid.module.css`.
- **Props**: `{ titles: Title[] }`.
- **Render**: `<ul className={styles.grid}>` con un `<TitleCard title={t} />` por título.
- **CSS**: `.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 12px; list-style: none; padding: 0 var(--space-4) }`; dentro, `.grid > li { flex: initial; padding: 0 }` para anular el ancho de carrusel de `TitleCard`.

## T092 · `MyListPage`
- **Crea**: `src/pages/MyListPage.tsx`. `export default function MyListPage()`.
- **Render**: `<Header />` y `<main id="main" tabIndex={-1} style={{ paddingTop: 'var(--header-height)' }}>` con `<h1>Mi lista</h1>`.
- **Lógica**: `titles = filterByProfile(ids.map(getTitle).filter(…), profile)`. Vacío → `<p data-testid="my-list-empty">Tu lista está vacía. Añade títulos con el botón +.</p>`; con datos → `<TitleGrid titles={titles} />`.

## T093 · Ruta `/my-list`
- **Edita**: `src/app/routes.tsx`: añade `{ path: '/my-list', element: <MyListPage /> }` en `children`, **antes** de la ruta `*`.

## T094 · `MyListPage.test.tsx`
- **Crea**: `src/pages/MyListPage.test.tsx` con `renderWithProviders(<MyListPage />, { profileId, route: '/my-list' })`.
- **Casos**: vacío → `my-list-empty`; con `localStorage.setItem('nbc:my-list:p-1', JSON.stringify(['t-001','t-002']))` y `profileId: 'p-1'` → 2 `title-card`; con perfil `p-4` y ids de clasificación no apta → no se muestran.

## T095 · GATE US6
- **Ejecuta**: `npm run typecheck && npm test && npm run build`. Commit: `feat(P10): mi lista`.
