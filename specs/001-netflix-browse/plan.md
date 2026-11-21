# Implementation Plan: Netflix Browse Clone

**Branch**: `001-netflix-browse` | **Date**: 2026-11-21 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-netflix-browse/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

Réplica de la página de exploración de Netflix como aplicación web estática (9 historias: cabecera, hero, filas con carrusel, tarjeta con previsualización, detalle, Mi lista, búsqueda, perfiles y reproductor simulado). Enfoque técnico: React 18 + Vite + TypeScript estricto, `react-router-dom` para las vistas, CSS Modules con variables, carrusel hecho a mano sobre scroll nativo con `scroll-snap`, modal propio con foco atrapado, y datos en JSON locales tipados. Estado mínimo con dos contextos (perfil y Mi lista) persistidos en `localStorage`. Detalle de las decisiones en [research.md](./research.md).

## Technical Context

**Language/Version**: TypeScript 5 (`"strict": true`) sobre React 18.3; Node ≥ 20

**Primary Dependencies**: react, react-dom, react-router-dom 6 (única dependencia extra de ejecución permitida). Build: Vite 5. Versiones fijadas en la instalación (`create-vite@5`, `react@18`, `vitest@2`); no usar `@latest`.

**Storage**: `localStorage` con prefijo `nbc:` (perfil activo, Mi lista por perfil, volumen). Catálogo en JSON importado en build.

**Testing**: Vitest + jsdom + Testing Library (react, user-event, jest-dom); selectores por `data-testid`

**Target Platform**: navegadores modernos de escritorio y móvil (últimas 2 versiones de Chrome, Firefox, Safari y Edge)

**Project Type**: web, solo front-end (una única aplicación)

**Performance Goals**: contenido de inicio usable en < 3 s (SC-005); resultados de búsqueda en < 1 s tras dejar de escribir (SC-007)

**Constraints**: sin backend ni red externa en ejecución; sin librerías de UI ni de carruseles; contraste ≥ 4.5:1; sin scroll horizontal de página en 360, 768, 1280 y 1920 px; respeto de `prefers-reduced-motion`

**Scale/Scope**: ~60 títulos, ~10 filas, 4 perfiles, 9 historias, 5 páginas

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | Evaluación inicial | Evaluación tras el diseño |
|---|---|---|
| I. Demo Scope | Pasa: sin backend, sin red externa; datos en JSON locales y activos en `public/assets/`. | Pasa: D7 importa los JSON en build; D8 usa un único vídeo local. |
| II. Fixed Stack | Pasa: React 18 + Vite + TS estricto, CSS Modules, carrusel propio, solo `react-router-dom` extra. | Pasa: D1, D3 y D12. Las herramientas de test y lint son `devDependencies`. |
| III. Accessibility | Pasa: requisitos de teclado, foco y movimiento reducido en la spec. | Pasa: D5 (modal con foco atrapado y restaurado), D14 y `useReducedMotion`. |
| IV. Responsive | Pasa: breakpoints 360/768/1280/1920 en la spec. | Pasa: D3 fija 6/5/4/3/2 tarjetas por ancho; carruseles con scroll interno. |
| V. Quality and Testability | Pasa: Vitest + Testing Library y `data-testid`. | Pasa: `contracts/testids.md` define los identificadores; lógica en funciones puras. |
| VI. Incremental Delivery | Pasa: cada historia deja `typecheck`, `test` y `build` en verde. | Pasa: `quickstart.md` fija la puerta de cada historia. |
| VII. Simplicity | Pasa: sin gestor de estado externo. | Pasa: dos contextos pequeños (D6); sin dependencias no justificadas. |

Resultado: **sin violaciones**. No se rellena Complexity Tracking.

## Project Structure

### Documentation (this feature)

```text
specs/001-netflix-browse/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
│   ├── types.ts         # Tipos del dominio
│   ├── hooks.md         # Funciones puras, hooks y componentes
│   ├── routes.md        # Rutas y reglas de acceso
│   └── testids.md       # Contrato de data-testid
├── checklists/
│   └── requirements.md
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
public/
└── assets/
    ├── posters/
    ├── banners/
    ├── logos/
    ├── avatars/
    └── video/
        └── sample.mp4

src/
├── main.tsx
├── app/
│   ├── App.tsx              # router y proveedores
│   └── routes.tsx
├── types/
│   └── index.ts             # copia de contracts/types.ts
├── data/
│   ├── catalog.json
│   ├── rows.json
│   ├── profiles.json
│   ├── notifications.json
│   └── catalog.ts           # capa de acceso tipada
├── lib/                     # funciones puras
│   ├── filterByProfile.ts
│   ├── searchTitles.ts
│   ├── rowsForView.ts
│   ├── pageSize.ts
│   ├── formatDuration.ts
│   └── storage.ts
├── hooks/
│   ├── useProfile.tsx
│   ├── useMyList.tsx
│   ├── useCarousel.ts
│   ├── useDebouncedValue.ts
│   ├── useFocusTrap.ts
│   ├── useReducedMotion.ts
│   └── useHoverPreview.ts
├── components/
│   ├── Header/
│   ├── NotificationsPanel/
│   ├── Hero/
│   ├── Row/
│   ├── TitleCard/
│   ├── Modal/
│   ├── TitleModal/
│   ├── Player/
│   ├── SearchBox/
│   ├── TitleGrid/
│   ├── AddToListButton/
│   └── ProfileGate/
├── pages/
│   ├── ProfilesPage.tsx
│   ├── BrowsePage.tsx
│   ├── SearchPage.tsx
│   ├── MyListPage.tsx
│   └── WatchPage.tsx
├── styles/
│   ├── tokens.css           # variables de color, espaciado, tipografía y z-index
│   └── global.css
└── test/
    └── setup.ts             # jest-dom y matchMedia simulado

tests/                       # pruebas de lógica pura y de comportamiento por historia
```

**Structure Decision**: aplicación única de front-end en la raíz del repositorio. Cada componente vive en su carpeta con su `*.module.css` y su `*.test.tsx` junto al código. La lógica sin interfaz va a `src/lib/` para probarla sin renderizar. Los datos se separan de la interfaz en `src/data/` (principio V).

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

Sin violaciones: no hay entradas.
