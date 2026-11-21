# Contrato: funciones puras, hooks y componentes

Firmas normativas. Cada elemento se implementa en el fichero indicado.

## Funciones puras (`src/lib/`)

| Fichero | Firma | Comportamiento |
|---|---|---|
| `filterByProfile.ts` | `filterByProfile(titles: Title[], profile: Profile \| null): Title[]` | Si `profile?.isKids`, deja solo `rating` en `KIDS_RATINGS`; si no, devuelve la entrada sin cambios. |
| `searchTitles.ts` | `searchTitles(query: string, titles: Title[]): Title[]` | Coincide por nombre, género o reparto, sin mayúsculas ni acentos. Consulta vacía o solo espacios → `[]`. |
| `rowsForView.ts` | `rowsForView(rows: Row[], view: View): Row[]` | Devuelve las filas cuyo `views` incluye `view`, en su orden original. |
| `pageSize.ts` | `itemsPerPage(width: number): 2 \| 3 \| 4 \| 5 \| 6` | ≥1400 → 6, ≥1100 → 5, ≥800 → 4, ≥500 → 3, resto → 2. |
| `formatDuration.ts` | `formatDuration(minutes: number): string` | `95` → `"1 h 35 min"`; `45` → `"45 min"`. |
| `storage.ts` | `readJson<T>(key: string, fallback: T, guard: (v: unknown) => v is T): T` y `writeJson(key: string, value: unknown): void` | Prefijo `nbc:` aplicado por quien llama. Lectura con `try/catch`; datos inválidos → `fallback`. |

## Hooks (`src/hooks/`)

| Hook | Firma | Devuelve |
|---|---|---|
| `useProfile` | `() => { profile: Profile \| null; selectProfile(id: string): void; signOut(): void }` | Perfil activo persistido en `nbc:profile`. |
| `useMyList` | `() => { ids: string[]; has(id: string): boolean; toggle(id: string): void }` | Lista del perfil activo en `nbc:my-list:<profileId>`. |
| `useCarousel` | `(itemCount: number) => { ref: RefObject<HTMLElement>; canPrev: boolean; canNext: boolean; prev(): void; next(): void; perPage: number }` | Paginación por scroll nativo. |
| `useDebouncedValue` | `<T>(value: T, delayMs: number) => T` | Valor retardado. |
| `useFocusTrap` | `(active: boolean) => RefObject<HTMLElement>` | Atrapa Tab dentro del elemento mientras `active`. |
| `useReducedMotion` | `() => boolean` | Refleja `prefers-reduced-motion: reduce`. |
| `useHoverPreview` | `(delayMs?: number) => { open: boolean; handlers: {...}; close(): void }` | Control de la previsualización (por defecto 400 ms). |

## Componentes (`src/components/`)

| Componente | Props | Notas |
|---|---|---|
| `Header` | ninguna | Lee perfil y vista actual del router. |
| `NotificationsPanel` | `{ open: boolean; onClose(): void; anchorRef: RefObject<HTMLElement \| null> }` | 3 avisos; cierra con Escape o clic fuera (excepto sobre `anchorRef`, el botón que lo abre). |
| `ProfileMenu` | ninguna | Lista de perfiles y "Cerrar sesión". |
| `CardPreview` | `{ title: Title; onOpenDetail(): void }` | Previsualización ampliada de la tarjeta. |
| `Hero` | `{ title: Title }` | Vídeo único o banner con movimiento reducido. |
| `Row` | `{ row: Row; titles: Title[] }` | Usa `useCarousel`; si `kind === 'top10'` muestra el número. |
| `TitleCard` | `{ title: Title; rank?: number }` | Previsualización con retardo; táctil abre detalle. |
| `TitleModal` | `{ title: Title; onClose(): void }` | Modal con foco atrapado; temporadas y similares. |
| `Modal` | `{ labelledBy: string; onClose(): void; children }` | Base reutilizable (portal, Escape, clic fuera). |
| `Player` | `{ title: Title }` | `<video>` con controles propios y atajos. |
| `ProfileGate` | ninguna | Pantalla "¿Quién está viendo ahora?". |
| `SearchBox` | ninguna | Lupa que expande el campo; sincroniza con la URL `/search?q=` (retardo de 250 ms). |
| `TitleGrid` | `{ titles: Title[] }` | Cuadrícula de resultados o de Mi lista. |
| `AddToListButton` | `{ titleId: string; testId?: string }` | Alterna `+` / `✓` con `aria-label` acorde. `testId` por defecto `add-to-list`. |

## Páginas (`src/pages/`)

`ProfilesPage`, `BrowsePage` (recibe `view`), `SearchPage`, `MyListPage`, `WatchPage`.
