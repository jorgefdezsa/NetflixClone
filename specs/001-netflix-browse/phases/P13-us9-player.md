# P13 · US9 Reproductor simulado (T113–T119)

**Objetivo**: `/watch/:id` reproduce el clip único con controles propios y atajos de teclado.
**Requisito previo**: P12 en verde. Usa `getTitle`, `readJson`/`writeJson`, clave `nbc:volume`.

## Test IDs de esta fase
`player`, `player-play`, `player-volume`, `player-progress`, `player-fullscreen`, `player-back`.

## T113 · `usePlayerShortcuts` [P]
- **Crea**: `src/hooks/usePlayerShortcuts.ts` y `usePlayerShortcuts.test.tsx`.
- **Firma**: `usePlayerShortcuts(actions: { togglePlay(): void; seek(seconds: number): void; toggleFullscreen(): void; toggleMute(): void; exit(): void }): void`.
- **Reglas**: listener `keydown` en `window`:

| Tecla | Acción |
|---|---|
| Espacio | `togglePlay()` con `preventDefault` |
| `ArrowLeft` | `seek(-5)` |
| `ArrowRight` | `seek(5)` |
| `f` / `F` | `toggleFullscreen()` |
| `m` / `M` | `toggleMute()` |
| `Escape` | `exit()` |

  Ignora eventos cuyo `target` sea `input`, `select` o `textarea`. Limpia el listener.
- **Prueba**: cada tecla llama a su acción; una tecla dentro de un `<input>` no.

## T114 · `Player.module.css` [P]
- **Crea**: `src/components/Player/Player.module.css`. Clases: `.player` (`position: fixed; inset: 0; background: #000`), `.video` (`width: 100%; height: 100%; object-fit: contain`), `.controls` (barra inferior flex sobre degradado, padding `var(--space-3)`), `.progress` (`flex: 1`), `.title` (arriba a la izquierda).

## T115 · `Player.tsx`
- **Crea**: `src/components/Player/Player.tsx`. Props `{ title: Title }`.
- **Render**: `<div data-testid="player" ref={containerRef} className={styles.player}>` con `<video ref className={styles.video} src="/assets/video/sample.mp4" autoPlay playsInline>`, el título (`title.name`) y los controles:

| `data-testid` | Elemento | Comportamiento |
|---|---|---|
| `player-play` | `<button>` | alterna reproducir/pausar; `aria-label` `"Pausar"` o `"Reproducir"` |
| `player-volume` | `<input type="range" min=0 max=1 step=0.05 aria-label="Volumen">` | valor inicial de `nbc:volume` (0–1; por defecto 1); lo guarda al cambiar |
| `player-progress` | `<input type="range" aria-label="Progreso">` | sigue `timeupdate`; al cambiar hace `video.currentTime = …` |
| `player-fullscreen` | `<button aria-label="Pantalla completa">` | `containerRef.current?.requestFullscreen()` |
| `player-back` | `<button aria-label="Volver">` | `navigate(-1)` |

- Usa `usePlayerShortcuts` con las acciones equivalentes (`toggleMute` pone `video.muted` al contrario; `exit` = `navigate(-1)`).

## T116 · `WatchPage` [P]
- **Crea**: `src/pages/WatchPage.tsx`. `export default function WatchPage()`: `const { id } = useParams(); const title = getTitle(id ?? '');` → sin título `<Navigate to="/browse" replace />`; con título `<Player title={title} />`.

## T117 · Ruta `/watch/:id`
- **Edita**: `src/app/routes.tsx`: dentro del grupo protegido añade
  `{ path: '/watch/:id', lazy: () => import('../pages/WatchPage').then(m => ({ Component: m.default })) }`.

## T118 · `Player.test.tsx`
- **Crea**: `src/components/Player/Player.test.tsx`.
- **Casos**: existen los 5 `player-*`; el botón de reproducir alterna su `aria-label`; el volumen se guarda en `nbc:volume`; la tecla Espacio alterna la reproducción; `player-back` navega atrás (comprueba con un `LocationDisplay`).

## T119 · GATE US9
- **Ejecuta**: `npm run typecheck && npm test && npm run build`. Commit: `feat(P13): reproductor`.
