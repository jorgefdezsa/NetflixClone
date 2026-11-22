# P09 · US5 Detalle de título (T081–T090)

**Objetivo**: modal accesible con sinopsis, reparto, géneros, año, duración, temporadas/episodios y títulos similares.
**Requisito previo**: P08 en verde. Usa `similarTitles`, `filterByProfile`, `SafeImage`, `AddToListButton`, `useTitleModal`.
**Salida**: "Más información" y el clic en una tarjeta abren el detalle; el foco queda atrapado y se restaura.

## Test IDs de esta fase
`title-modal`, `modal-dialog`, `modal-close`, `season-select`, `episode-item`, `similar-title`.

## T081 · `useFocusTrap` [P]
- **Crea**: `src/hooks/useFocusTrap.ts` y `useFocusTrap.test.tsx`.
- **Firma**: `useFocusTrap(active: boolean): RefObject<HTMLDivElement>`.
- **Reglas**: mientras `active`, `Tab` en el último elemento enfocable vuelve al primero y `Shift+Tab` en el primero va al último (`preventDefault`). Selector de enfocables: `a[href], button:not(:disabled), input, select, textarea, [tabindex]:not([tabindex="-1"])`. El listener `keydown` va en el elemento del `ref`.
- **Prueba**: componente con 3 botones; `Tab` desde el último vuelve al primero; `Shift+Tab` desde el primero va al último.

## T082 · `Modal.module.css` [P]
- **Crea**: `src/components/Modal/Modal.module.css`. Clases: `.backdrop` (`position: fixed; inset: 0; background: rgba(0,0,0,.7); z-index: var(--z-modal); display: flex; justify-content: center; overflow-y: auto`) y `.dialog` (`width: min(850px, 100%); margin: var(--space-5) 0; background: var(--color-surface); border-radius: 8px; outline: none`).

## T083 · `Modal.tsx`
- **Crea**: `src/components/Modal/Modal.tsx`. Props `{ labelledBy: string; onClose(): void; children: ReactNode }`.
- **Render**: `createPortal(…, document.body)` de:
  - `<div className={styles.backdrop} onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>`
  - dentro `<div data-testid="modal-dialog" role="dialog" aria-modal="true" aria-labelledby={labelledBy} tabIndex={-1} ref={useFocusTrap(true)} className={styles.dialog}>{children}</div>`.
- **Efectos**: al montar guarda `document.activeElement`, enfoca el diálogo y pone `document.body.style.overflow = 'hidden'`; `Escape` (listener en `document`) llama a `onClose`; al desmontar restaura el `overflow` y devuelve el foco al elemento guardado.

## T084 · `Modal.test.tsx`
- **Crea**: `src/components/Modal/Modal.test.tsx`.
- **Casos**: `modal-dialog` tiene `role="dialog"`, `aria-modal="true"` y `aria-labelledby` (con `toHaveAttribute`); `Escape` y el clic en el fondo llaman a `onClose`; al desmontar el foco vuelve al botón que lo abrió; `Tab`/`Shift+Tab` permanecen dentro.

## T085 · `TitleModal.module.css` [P]
- **Crea**: `src/components/TitleModal/TitleModal.module.css`. Clases: `.header` (banner con degradado inferior), `.close` (arriba a la derecha), `.meta`, `.episodes` (lista), `.similar` (cuadrícula de 3 columnas; 2 en móvil con `@media (max-width: 767px)`).

## T086 · `TitleModal.tsx`
- **Crea**: `src/components/TitleModal/TitleModal.tsx`. Props `{ title: Title; onClose(): void }`.
- **Render**: `<Modal labelledBy="title-modal-heading" onClose={onClose}>` con `<div data-testid="title-modal">` que contiene:
  1. `SafeImage` del banner (850×383);
  2. `<h2 id="title-modal-heading">{title.name}</h2>`;
  3. `<button data-testid="modal-close" aria-label="Cerrar">` → `onClose`;
  4. botón "Reproducir" → `navigate('/watch/' + id)` y `onClose()`;
  5. `<AddToListButton titleId={title.id} />`;
  6. año, `rating`, duración (`formatDuration`) o nº de temporadas, géneros, reparto y sinopsis;
  7. solo `type === 'series'`: `<select data-testid="season-select" aria-label="Temporada">` (una opción por temporada) y un `<li data-testid="episode-item">` por episodio de la temporada elegida (número, nombre, duración); sin episodios → texto "Sin episodios";
  8. sección "Títulos similares": `similarTitles(title, filterByProfile(titles, profile))` → un `<button data-testid="similar-title">` por título que llama a `useTitleModal().open(similar)`.

## T087 · `TitleModalHost` [P]
- **Crea**: `src/components/TitleModal/TitleModalHost.tsx`.
- **Contrato**: `export default function TitleModalHost() { const { current, close } = useTitleModal(); return current ? <TitleModal title={current} onClose={close} /> : null; }`

## T088 · `RootLayout` con host del modal
- **Edita**: `src/app/RootLayout.tsx`: renderiza `<Outlet />` y a continuación `<TitleModalHost />` (en un fragmento).

## T089 · `TitleModal.test.tsx`
- **Crea**: `src/components/TitleModal/TitleModal.test.tsx`.
- **Casos**: película → muestra duración y no existe `season-select`; serie → hay `season-select` y `episode-item`, y cambiar de temporada cambia la lista; `Escape` y `modal-close` llaman a `onClose`; `similar-title` abre otro título.

## T090 · GATE US5
- **Ejecuta**: `npm run typecheck && npm test && npm run build`. Commit: `feat(P09): detalle`.
