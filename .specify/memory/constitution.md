<!--
Sync Impact Report
Version change: 1.0.0 → 1.1.0
Added principles: VIII (Small-Model Friendly Artifacts)
Earlier: 0.1.0 (template defaults) → 1.0.0 added I–VII (Demo Scope, Fixed Stack, Accessibility,
  Responsive Mobile-First, Quality and Testability, Incremental Delivery, Simplicity)
Removed sections: none
Deferred items: none
-->
# Netflix Browse Clone Constitution

## Core Principles

### I. Demo Scope
The project MUST be a static front-end demo. It MUST NOT include a backend, real
authentication, analytics or external network calls at runtime. All data MUST live in local
JSON files and all assets (logos, posters, banners, video) in `public/assets/`.

### II. Fixed Stack
The project MUST use React 18 + Vite + TypeScript with `"strict": true`. The `any` type is
forbidden unless justified in a code comment. Styles MUST use CSS Modules and CSS variables.
UI and carousel libraries are forbidden: the carousel MUST be hand-built.
`react-router-dom` is the only extra runtime dependency allowed.

### III. Accessibility (WCAG 2.2 AA)
The UI MUST support full keyboard navigation, visible focus, correct roles and aria
attributes, contrast of at least 4.5:1, and MUST respect `prefers-reduced-motion`. Modals
MUST trap focus and restore it to the triggering element on close.

### IV. Responsive Mobile-First
The UI MUST be correct at 360, 768, 1280 and 1920 px with no horizontal page scroll.
Carousels scroll internally.

### V. Quality and Testability
Components MUST be small and typed, and data MUST be separated from UI. Identifiers MUST be
in English and user-facing text in Spanish (es-ES). Key logic MUST be covered by Vitest and
Testing Library, and every test selector MUST use `data-testid`.

### VI. Incremental Delivery
Each user story MUST leave the app passing `npm run typecheck`, `npm test` and
`npm run build` before the next story starts.

### VII. Simplicity
The simplest solution that meets the requirement SHOULD be preferred. Any new dependency
MUST be justified in `plan.md`.

### VIII. Small-Model Friendly Artifacts
Implementation MUST be doable by a small local model. Planning documents MUST be modular and
self-contained: tasks live in per-phase files under `phases/`, each file MUST stay under 7 KB,
and each task card MUST name one primary file, its exports, its `data-testid` values and a
verifiable "Hecho cuando". Shared rules live only in `IMPLEMENT.md`. An implementer MUST NOT
need to read more than `IMPLEMENT.md` and one phase file per run.

## Governance

This constitution supersedes other practices. Deviations MUST be documented in `plan.md`
(Complexity Tracking). Amendments follow semantic versioning: MAJOR for removing or
redefining a principle, MINOR for adding or materially expanding one, PATCH for
clarifications.

**Version**: 1.1.0 | **Ratified**: 2026-11-21 | **Last Amended**: 2026-11-21
