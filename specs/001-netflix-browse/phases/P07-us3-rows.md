# P07 · US3 Filas de títulos / carruseles (T067–T074)

**Objetivo**: filas con scroll horizontal paginado (flechas, teclado, táctil), extremos deshabilitados y fila Top 10 con números.
**Requisito previo**: P06 en verde. Usa `itemsPerPage` (`src/lib/pageSize.ts`), `rowsForView`, `filterByProfile`, `rows`/`getTitle` (`src/data/catalog.ts`).
**Salida**: `/browse` muestra las 6 filas de `home`; las demás vistas, las suyas.

## Test IDs de esta fase
`row`, `row-title`, `row-prev`, `row-next`, `title-card`, `top10-rank`, `browse-empty`.

## T067 · `useCarousel`
- **Crea**: `src/hooks/useCarousel.ts` y `useCarousel.test.ts`.
- **Firma**: `useCarousel(itemCount: number): { ref: RefObject<HTMLUListElement>; canPrev: boolean; canNext: boolean; prev(): void; next(): void; perPage: number }`.
- **Reglas**:
  - `perPage = itemsPerPage(window.innerWidth)`, recalculado en `resize`.
  - `prev()`/`next()`: `ref.current.scrollBy({ left: ∓ref.current.clientWidth, behavior: reduced ? 'auto' : 'smooth' })`, con `reduced = useReducedMotion()`.
  - `canPrev = scrollLeft > 0`; `canNext = scrollLeft + clientWidth < scrollWidth - 1`. Se recalculan en `scroll`, `resize` y cuando cambia `itemCount`.
- **Prueba**: elemento con `scrollLeft`, `clientWidth` y `scrollWidth` definidos con `Object.defineProperty`; comprueba `canPrev`/`canNext` y que `next()` llama a `scrollBy`.

## T068 · `TitleCard.module.css` [P]
- **Crea**: `src/components/TitleCard/TitleCard.module.css`. Clases:

| Clase | Estilo |
|---|---|
| `.card` | `flex: 0 0 calc(100% / var(--per-page, 6)); padding: 0 4px; position: relative; list-style: none` |
| `.thumb` | `width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 4px; display: block` |
| `.poster` | `aspect-ratio: 2/3` |
| `.rank` | número grande con contorno, a la izquierda del póster |
| `.button` | `background: none; border: 0; padding: 0; width: 100%` |

## T069 · `TitleCard.tsx` (primera versión)
- **Crea**: `src/components/TitleCard/TitleCard.tsx`. `export default function TitleCard({ title, rank }: { title: Title; rank?: number })`.
- **Render**: `<li data-testid="title-card" data-title-id={title.id} className={styles.card}>` con `<button type="button" aria-label={title.name} onClick={() => open(title)}>` (`open` de `useTitleModal()`) que contiene:
  - sin `rank`: `SafeImage` del `banner` (320×180, clase `thumb`);
  - con `rank`: `SafeImage` del `poster` (200×300, clase `poster`) y `<span data-testid="top10-rank" aria-hidden="true" className={styles.rank}>{rank}</span>`.

## T070 · `Row.module.css` [P]
- **Crea**: `src/components/Row/Row.module.css`. Clases:

| Clase | Estilo |
|---|---|
| `.row` | `position: relative; margin: var(--space-4) 0` |
| `.list` | `display: flex; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; list-style: none; padding: var(--preview-space-top) var(--preview-space-inline) var(--preview-space-bottom); margin: calc(-1 * var(--preview-space-top)) calc(-1 * var(--preview-space-inline)) calc(-1 * var(--preview-space-bottom)); scroll-padding-inline: var(--preview-space-inline)` |
| `.list > li` | `scroll-snap-align: start` |
| `.arrow` | posición absoluta a cada lado, `opacity: 0`; visible con `.row:hover .arrow` y `.arrow:focus-visible`; `.arrow:disabled { display: none }` |
| `.row:is(:hover, :focus-within)` | `z-index: var(--z-preview)` |

(El relleno reserva sitio para la previsualización de P08 dentro del contenedor con scroll; el margen negativo evita que cambie el diseño.)

## T071 · `Row.tsx`
- **Crea**: `src/components/Row/Row.tsx`. Props `{ row: RowType; titles: Title[] }` (importa el tipo como `import type { Row as RowType } from '../../types'`).
- **Render**: si `titles.length === 0` → `null`. Si no: `<section data-testid="row" aria-labelledby={`${row.id}-title`}>` con:
  - `<h2 id={`${row.id}-title`} data-testid="row-title">{row.name}</h2>`;
  - `<button data-testid="row-prev" aria-label="Anterior" disabled={!canPrev} onClick={prev}>` y `<button data-testid="row-next" aria-label="Siguiente" disabled={!canNext} onClick={next}>`;
  - `<ul ref={ref} style={{ '--per-page': perPage } as CSSProperties} onKeyDown>` con un `TitleCard` por título; `rank={index + 1}` solo si `row.kind === 'top10'`.
- **Teclado**: en el `<ul>`, `ArrowRight` → `next()`, `ArrowLeft` → `prev()`.

## T072 · `BrowsePage` con filas
- **Edita**: `src/pages/BrowsePage.tsx`. Tras el hero:
  1. `const items = rowsForView(rows, view).map(row => ({ row, titles: filterByProfile(row.titleIds.map(getTitle).filter((t): t is Title => Boolean(t)), profile) }))`;
  2. renderiza `<Row key={row.id} row={row} titles={titles} />` por cada item con `titles.length > 0`;
  3. si ninguna fila tiene títulos → `<p data-testid="browse-empty">No hay contenido disponible en esta vista.</p>`.

## T073 · `Row.test.tsx`
- **Crea**: `src/components/Row/Row.test.tsx`.
- **Casos**: fila de 12 títulos → 12 `title-card`; `row-prev` deshabilitado al inicio; fila `top10` muestra `top10-rank` con 1…10; fila sin títulos no renderiza `row`; `ArrowRight` en la lista llama a `scrollBy` (espía en `Element.prototype`).

## T074 · GATE US3
- **Ejecuta**: `npm run typecheck && npm test && npm run build`. A mano: 6/5/4/3/2 tarjetas al redimensionar.
- Commit: `feat(P07): filas`.
