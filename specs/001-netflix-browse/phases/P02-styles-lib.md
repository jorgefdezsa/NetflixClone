# P02 · Estilos base y lógica pura (T011–T020)

**Objetivo**: tokens CSS, estilos globales y 7 funciones puras con sus pruebas.
**Requisito previo**: P01 en verde. Tipos en `src/types/index.ts` (`Title`, `Profile`, `Row`, `View`, `KIDS_RATINGS`).
**Regla**: cada función pura va en su fichero con export con nombre y su `.test.ts` al lado.

## T011 · `src/styles/tokens.css`
- **Crea**: `src/styles/tokens.css` con un único bloque `:root`.
- **Variables**:

| Grupo | Variables |
|---|---|
| Color | `--color-bg: #141414`, `--color-surface: #1f1f1f`, `--color-text: #ffffff`, `--color-text-muted: #b3b3b3`, `--color-accent: #e50914`, `--color-focus: #ffffff` |
| Espacio | `--space-1: 4px`, `--space-2: 8px`, `--space-3: 16px`, `--space-4: 24px`, `--space-5: 32px`, `--space-6: 48px` |
| Tipografía | `--font-family: system-ui, sans-serif` |
| Capas | `--z-header: 100`, `--z-preview: 50`, `--z-modal: 200` |
| Previsualización | `--preview-space-top: 24px`, `--preview-space-bottom: 160px`, `--preview-space-inline: 32px` |
| Cabecera | `--header-height: 68px` |

- **Hecho cuando**: las 18 variables existen.

## T012 · `src/styles/global.css`
- **Crea**: `src/styles/global.css`.
- **Contenido**:
  - `@import './tokens.css';`
  - reset: `*, *::before, *::after { box-sizing: border-box; margin: 0 }`
  - `html { color-scheme: dark }`
  - `body`: fondo `var(--color-bg)`, color `var(--color-text)`, `font-family: var(--font-family)`, `overflow-x: hidden`
  - `button { font: inherit; cursor: pointer }`
  - `:focus-visible { outline: 3px solid var(--color-focus); outline-offset: 2px }`
  - `.sr-only`: oculto visualmente (clip rect 0, 1×1 px, `position: absolute`)
  - `.skip-link`: `position: absolute; left: -9999px`; con `:focus` `left: 8px; top: 8px; z-index: 300`
  - `@media (prefers-reduced-motion: reduce)`: `*` con `animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important`.
- **Hecho cuando**: contiene `.sr-only`, `.skip-link` y el bloque de movimiento reducido.

## T013 · `storage` [P]
- **Crea**: `src/lib/storage.ts`, `src/lib/storage.test.ts`.
- **Firmas**:
  ```ts
  export function readJson<T>(key: string, fallback: T, guard: (v: unknown) => v is T): T
  export function writeJson(key: string, value: unknown): void
  ```
- **Reglas**: `readJson` usa `localStorage.getItem` + `JSON.parse` dentro de `try/catch`; si no hay valor, el JSON es inválido o `guard` devuelve `false` → `fallback`. `writeJson` usa `try/catch` y no lanza nunca.
- **Pruebas**: valor válido; clave ausente; JSON roto; valor de tipo inválido.

## T014 · `filterByProfile` [P]
- **Crea**: `src/lib/filterByProfile.ts`, `.test.ts`.
- **Firma**: `filterByProfile(titles: Title[], profile: Profile | null): Title[]`
- **Regla**: si `profile?.isKids` → solo títulos con `rating` incluido en `KIDS_RATINGS`; si no → devuelve `titles` tal cual.
- **Pruebas**: perfil `null`, perfil adulto, perfil infantil con mezcla de edades.

## T015 · `searchTitles` [P]
- **Crea**: `src/lib/searchTitles.ts`, `.test.ts`.
- **Firma**: `searchTitles(query: string, titles: Title[]): Title[]`
- **Reglas**: normaliza `query` y textos con `s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()`. Coincide si `query` está contenida en `name`, en algún `genres` o en algún `cast`. Consulta vacía o solo espacios → `[]`.
- **Pruebas**: por nombre, por género, por actor, sin acentos (`"accion"` encuentra `"Acción"`), vacía.

## T016 · `rowsForView` [P]
- **Crea**: `src/lib/rowsForView.ts`, `.test.ts`.
- **Firma**: `rowsForView(rows: Row[], view: View): Row[]`
- **Regla**: filas cuyo `views` incluye `view`, en el orden original.

## T017 · `itemsPerPage` [P]
- **Crea**: `src/lib/pageSize.ts`, `.test.ts`.
- **Firma**: `itemsPerPage(width: number): 2 | 3 | 4 | 5 | 6`
- **Tabla**:

| Ancho | Resultado |
|---|---|
| ≥ 1400 | 6 |
| ≥ 1100 | 5 |
| ≥ 800 | 4 |
| ≥ 500 | 3 |
| resto | 2 |

- **Pruebas**: los límites 1400, 1399, 1100, 800, 500, 499.

## T018 · `formatDuration` [P]
- **Crea**: `src/lib/formatDuration.ts`, `.test.ts`.
- **Firma**: `formatDuration(minutes: number): string`
- **Ejemplos**: `95` → `"1 h 35 min"`; `45` → `"45 min"`; `120` → `"2 h"`.

## T019 · `similarTitles` [P]
- **Crea**: `src/lib/similarTitles.ts`, `.test.ts`.
- **Firma**: `similarTitles(title: Title, all: Title[], limit = 6): Title[]`
- **Reglas**: excluye el propio título; conserva los que comparten ≥ 1 género; ordena por nº de géneros compartidos (desc) y luego por `name` (asc); recorta a `limit`.

## T020 · GATE P02
- **Ejecuta**: `npm run typecheck && npm test`.
- **Hecho cuando**: verde, con 7 ficheros de prueba. Commit: `feat(P02): estilos base y lógica pura`.
