# Quickstart: Netflix Browse Clone

**Feature**: `001-netflix-browse`

> **Implementación con modelo local**: lee `IMPLEMENT.md` y trabaja fase a fase con `phases/PNN-*.md`. Este quickstart resume lo que esas fichas ejecutan.

## Requisitos

- Node.js ≥ 20 y npm.

## Crear el proyecto (una sola vez)

El directorio ya contiene `.git`, `.github`, `.specify` y `specs`, por lo que Vite preguntará si ignorar los ficheros existentes: elige **"Ignore files and continue"**.

```bash
cd /Users/jorgefdezsa/Sources/Netflix
npm create vite@5 . -- --template react-ts
npm install
npm install react-router-dom@6
npm install -D vitest@2 jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom
npm ls react vite vitest   # React 18.x, Vite 5.x
```

Scripts esperados en `package.json`:

| Script | Comando |
|---|---|
| `dev` | `vite` |
| `build` | `tsc -b && vite build` |
| `preview` | `vite preview` |
| `test` | `vitest run` |
| `typecheck` | `tsc -b` |
| `lint` | `eslint .` |

## Uso

```bash
npm run dev        # http://localhost:5173
npm run typecheck && npm test && npm run build   # puerta de cada historia
```

## Comprobación manual por historia

| Historia | Qué verificar |
|---|---|
| US1 Cabecera | Transparente arriba, sólida al hacer scroll; menú desplegable en 360 px; enlaces Series/Películas/Novedades filtran; panel de 3 avisos con Escape. |
| US2 Hero | Título a ancho completo, botones funcionan, vídeo detenido con movimiento reducido. |
| US3 Filas | Flechas al pasar el ratón, extremos deshabilitados, 6/5/4/3/2 tarjetas, Top 10 con números. |
| US4 Tarjeta | Se amplía tras ~400 ms sin mover la fila; Escape cierra; táctil abre detalle. |
| US5 Detalle | Foco atrapado y restaurado; temporadas y episodios en series. |
| US6 Mi lista | `+`/`✓`, persiste tras recargar, mensaje cuando está vacía. |
| US7 Búsqueda | Título, género y actor; sin resultados; vaciar vuelve al inicio. |
| US8 Perfiles | 4 perfiles; Infantil solo `TP` y `7+`; perfil recordado. |
| US9 Reproductor | Controles y atajos (espacio, ←, →, F, M, Escape). |

## Activos locales necesarios

`public/assets/{posters,banners,logos,video}`; el vídeo es un único `video/sample.mp4`.
