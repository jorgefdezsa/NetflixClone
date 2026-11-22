# P08 · US4 Tarjeta con previsualización (T075–T080)

**Objetivo**: al pasar el ratón o enfocar (≈ 400 ms) la tarjeta se amplía con acciones, edad, duración/temporadas y géneros, sin mover la fila. En táctil, un toque abre el detalle.
**Requisito previo**: P07 en verde. Usa `AddToListButton`, `formatDuration`, `SafeImage`.

## Test IDs de esta fase
`card-preview`, `preview-play`, `preview-add`, `preview-like`, `preview-more`.

## T075 · `useHoverPreview`
- **Crea**: `src/hooks/useHoverPreview.ts` y `useHoverPreview.test.ts`.
- **Firma**:
  ```ts
  useHoverPreview(delayMs = 400): {
    open: boolean;
    handlers: { onMouseEnter(): void; onMouseLeave(): void; onFocus(): void; onBlur(): void; onKeyDown(e: KeyboardEvent): void };
    close(): void;
  }
  ```
- **Reglas**: `onMouseEnter`/`onFocus` abren tras `delayMs` (con `setTimeout`); `onMouseLeave`/`onBlur` cancelan el temporizador y cierran; `onKeyDown` con `Escape` cierra; si `window.matchMedia('(hover: none)').matches`, **nunca** abre. Limpia el temporizador al desmontar.
- **Prueba**: `vi.useFakeTimers()`; abre a los 400 ms y no antes; `Escape` cierra; con `(hover: none)` simulado a `true` no abre.

## T076 · `CardPreview.module.css` [P]
- **Crea**: `src/components/TitleCard/CardPreview.module.css`. Clases:

| Clase | Estilo |
|---|---|
| `.preview` | `position: absolute; top: -16px; left: -12%; width: 124%; z-index: var(--z-preview); background: var(--color-surface); border-radius: 6px; box-shadow: 0 8px 24px rgba(0,0,0,.6)` |
| `.image` | `width: 100%; aspect-ratio: 16/9; object-fit: cover` |
| `.actions` | fila flex con huecos; botones circulares 36×36 |
| `.meta` | texto pequeño: edad, duración, géneros |

## T077 · `CardPreview.tsx`
- **Crea**: `src/components/TitleCard/CardPreview.tsx`. Props `{ title: Title; onOpenDetail(): void }`.
- **Render**: `<div data-testid="card-preview" role="group" aria-label={title.name} className={styles.preview}>` con:
  - `SafeImage` del banner (320×180, clase `image`);
  - `<button data-testid="preview-play" aria-label="Reproducir">` → `navigate('/watch/' + title.id)`;
  - `<AddToListButton titleId={title.id} testId="preview-add" />`;
  - `<button data-testid="preview-like" aria-label="Me gusta" aria-pressed={liked}>` con estado local;
  - `<button data-testid="preview-more" aria-label="Más información">` → `onOpenDetail()`;
  - `<p className={styles.meta}>`: `rating`, `formatDuration(durationMinutes)` (película) o `${n} temporadas` (serie), y los géneros unidos con `" • "`.

## T078 · `TitleCard.tsx` con previsualización
- **Edita**: `src/components/TitleCard/TitleCard.tsx`.
- **Añade**: `const { open: previewOpen, handlers, close } = useHoverPreview();` aplica `handlers` al `<li>`; si `previewOpen && rank === undefined` renderiza dentro del `<li>`: `<CardPreview title={title} onOpenDetail={() => { close(); openModal(title); }} />`.

## T079 · `TitleCard.test.tsx`
- **Crea**: `src/components/TitleCard/TitleCard.test.tsx`. `vi.useFakeTimers()`; usa `fireEvent.mouseEnter` y `act(() => vi.advanceTimersByTime(400))`.
- **Casos**:
  1. tras `mouseEnter` + 400 ms aparece `card-preview` con los 4 botones (`preview-play`, `preview-add`, `preview-like`, `preview-more`);
  2. `Escape` (`fireEvent.keyDown`) lo cierra;
  3. `mouseLeave` lo cierra;
  4. con `matchMedia('(hover: none)')` simulado a `matches: true` no aparece;
  5. el clic en la tarjeta abre el modal (consumidor auxiliar de `useTitleModal`, como en P06).

## T080 · GATE US4
- **Ejecuta**: `npm run typecheck && npm test && npm run build`. Commit: `feat(P08): previsualización`.
