# Netflix Browse Clone

Demo de navegación al estilo Netflix hecha con React 18, TypeScript y Vite. Es una demo local: el catálogo (60 títulos ficticios, 11 filas, 4 perfiles) vive en `src/data` y no hay servidor ni cuentas reales.

Qué incluye: cabecera con notificaciones y menú de perfil, título destacado, filas con carrusel y Top 10, tarjeta con previsualización, detalle de título (con temporadas y similares), Mi lista, búsqueda, selección de perfil (con perfil Infantil) y un reproductor simulado con atajos de teclado.

## Requisitos

- Node.js ≥ 20 y npm.

## Puesta en marcha

```bash
npm install
npm run assets   # genera los SVG provisionales en public/assets (ya incluidos en el repo)
npm run dev      # http://localhost:5173
```

## Scripts

| Script | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo de Vite. |
| `npm run build` | Comprueba tipos (`tsc -b`) y genera `dist/`. |
| `npm run preview` | Sirve `dist/` en local. |
| `npm test` | Pruebas con Vitest (una sola pasada). |
| `npm run typecheck` | Comprobación de tipos (`tsc -b`). |
| `npm run lint` | ESLint sobre todo el proyecto. |
| `npm run assets` | Regenera pósteres, banners y avatares SVG a partir de los datos. |

Puerta de calidad antes de cada commit: `npm run lint && npm run typecheck && npm test && npm run build`.

## Estructura

```text
src/app/         RootLayout, App, routes, RequireProfile, HomeRedirect
src/components/  <Nombre>/<Nombre>.tsx + .module.css + .test.tsx
src/data/        JSON del catálogo y catalog.ts
src/hooks/       hooks y proveedores de contexto
src/lib/         funciones puras (con sus pruebas)
src/pages/       páginas (Browse, Search, MyList, Profiles, Watch)
src/styles/      tokens.css y global.css
src/test/        setup de Vitest y renderWithProviders
src/types/       tipos del dominio
public/assets/   posters, banners, avatars, placeholder.svg y video/
scripts/         generate-placeholders.mjs
specs/           especificación, plan y fichas de implementación (Spec Kit)
```

## Imágenes y vídeo

Los pósteres, banners y avatares de `public/assets` son SVG provisionales generados por `npm run assets`. Se pueden sustituir por arte real conservando el mismo nombre de fichero (`posters/t-001.svg`, etc.).

El título destacado y el reproductor usan un único clip: `public/assets/video/sample.mp4` (no incluido; un vídeo corto de 15 s o menos). Sin él, el hero muestra el banner y el reproductor se ve negro, pero los controles funcionan.

## Persistencia

Todo se guarda en `localStorage`: `nbc:profile` (perfil activo), `nbc:my-list:<perfil>` (Mi lista) y `nbc:volume` (volumen del reproductor).

## Desarrollo con Spec Kit

El proyecto se planificó con [Spec Kit](https://github.com/github/spec-kit) (versión `1.2.2.dev0`, integración `copilot`), siguiendo el flujo constitución → especificación → plan → tareas. Los comandos están instalados como *skills* en `.github/skills/` y se invocan como `/speckit-<nombre>`.

| Comando | Qué produjo |
|---|---|
| `/speckit-constitution` | `.specify/memory/constitution.md` (v1.1.0, principios I–VIII) |
| `/speckit-specify` | `specs/001-netflix-browse/spec.md` y `checklists/requirements.md` |
| `/speckit-clarify` | Sección «Clarifications» de la spec (4 preguntas y respuestas) |
| `/speckit-plan` | `plan.md`, `research.md`, `data-model.md`, `contracts/` y `quickstart.md` |
| `/speckit-tasks` | `tasks.md` (índice con casillas) y las fichas `phases/P01…P14` |

La implementación **no** se hizo con `/speckit-implement`: se siguió a mano `specs/001-netflix-browse/IMPLEMENT.md` y la ficha de cada fase, con un commit por fase. No se han usado `/speckit-analyze`, `/speckit-checklist`, `/speckit-converge` ni `/speckit-taskstoissues`, y Spec Kit no ha hecho ninguna llamada a GitHub.

Los prompts exactos no se conservan, así que la cronología completa (con la evidencia de cada paso y lo que es inferido) está reconstruida en [`specs/001-netflix-browse/README.md`](specs/001-netflix-browse/README.md).

## Documentación

**Usar Spec Kit con Copilot CLI o Claude Code, con modelos locales (oMLX) o en la nube:** [`docs/INTEGRACION-AGENTES.md`](docs/INTEGRACION-AGENTES.md).

Reglas del proyecto en `.specify/memory/constitution.md`; especificación, plan, contratos y tareas en `specs/001-netflix-browse/`. Las desviaciones respecto a las fichas están en `specs/001-netflix-browse/NOTES.md`.
