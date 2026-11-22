# P06 · US2 Título destacado / hero (T060–T066)

**Objetivo**: hero a ancho completo con banner o vídeo único, sinopsis, etiqueta de edad y dos botones.
**Requisito previo**: P05 en verde.
**Salida**: `/browse` muestra el hero de `t-001`; "Reproducir" navega a `/watch/t-001` (la página llega en P13); "Más información" llama a `useTitleModal().open(title)` (la interfaz llega en P09).

## Test IDs de esta fase
`hero`, `hero-play`, `hero-more-info`.

## T060 · `useReducedMotion` [P]
- **Crea**: `src/hooks/useReducedMotion.ts` y `useReducedMotion.test.ts`.
- **Firma**: `export function useReducedMotion(): boolean`.
- **Reglas**: usa `window.matchMedia('(prefers-reduced-motion: reduce)')`; estado inicial = `matches`; se suscribe a `change` y limpia.
- **Prueba**: sustituye `window.matchMedia` por una versión con `matches: true` y comprueba que devuelve `true`.

## T061 · `Hero.module.css` [P]
- **Crea**: `src/components/Hero/Hero.module.css`. Clases:

| Clase | Estilo |
|---|---|
| `.hero` | `position: relative; width: 100%; height: min(80vh, 720px); overflow: hidden` |
| `.media` | `position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover` |
| `.overlay` | `position: absolute; inset: 0; background: linear-gradient(to right, rgba(0,0,0,.8), transparent 60%), linear-gradient(to top, var(--color-bg), transparent 30%)` |
| `.content` | `position: relative; max-width: 560px; padding: 0 var(--space-4); margin-top: 28vh`; sinopsis limitada a 3 líneas (`-webkit-line-clamp: 3`) |
| `.badge` | borde 1 px, texto pequeño |
| `.play` | fondo blanco, texto negro |
| `.more` | fondo gris translúcido, texto blanco |

## T062 · `Hero.tsx`
- **Crea**: `src/components/Hero/Hero.tsx`. `export default function Hero({ title }: { title: Title })`.
- **Render** (dentro de `<section data-testid="hero" aria-label="Título destacado" className={styles.hero}>`):
  1. `SafeImage` del `title.banner` (`alt=""`, 1600×700, `loading="eager"`, clase `styles.media`).
  2. Si `!useReducedMotion()`: `<video className={styles.media} src="/assets/video/sample.mp4" autoPlay muted loop playsInline poster={title.banner} onError={ocultar}>`; con `onError` se oculta (estado local).
  3. `<div className={styles.overlay} />`.
  4. Contenido: `<h2>{title.name}</h2>` (o `SafeImage` del `logo` si existe), `<p>{title.synopsis}</p>`, `<span className={styles.badge}>{title.rating}</span>`.
  5. `<button data-testid="hero-play">Reproducir</button>` → `navigate('/watch/' + title.id)`.
  6. `<button data-testid="hero-more-info">Más información</button>` → `useTitleModal().open(title)`.

## T063 · `BrowsePage` con hero
- **Edita**: `src/pages/BrowsePage.tsx`.
- **Añade**: `const { profile } = useProfile(); const visible = filterByProfile(titles, profile); const featured = visible.find(t => t.id === FEATURED_ID) ?? visible[0];`. Si `featured` existe, renderiza `<Hero title={featured} />` en `<main>`, justo después del `<h1 className="sr-only">`.
- **Importa** de `../data/catalog` (`titles`, `FEATURED_ID`) y `../lib/filterByProfile`.

## T064 · `Hero.test.tsx`
- **Crea**: `src/components/Hero/Hero.test.tsx`. Usa `renderWithProviders`.
- **Casos**:
  1. muestra nombre, sinopsis y etiqueta de edad;
  2. existen `hero-play` y `hero-more-info`;
  3. con `matchMedia` simulado a `matches: true` no existe `<video>` (`container.querySelector('video')` es `null`);
  4. el clic en `hero-more-info` abre el modal: renderiza un consumidor auxiliar con `useTitleModal()` que muestre `current?.name` en un `<span data-testid="current-title">`.

## T065 · [MANUAL] Vídeo de muestra
- **Persona**: copia un vídeo corto (≤ 15 s) a `public/assets/video/sample.mp4`. Sin él, el hero muestra el banner.

## T066 · GATE US2
- **Ejecuta**: `npm run typecheck && npm test && npm run build`. Commit: `feat(P06): hero`.
