---
description: "Índice de tareas de Netflix Browse Clone"
---

# Tasks: Netflix Browse Clone

**Cómo se usa este fichero**: es solo el **índice con casillas**. El detalle de cada tarea (fichero, contrato, criterios) está en su ficha `phases/PNN-*.md`. Quien implementa lee `IMPLEMENT.md` + **una** ficha de fase y marca aquí `- [X] T###`.

**Formato**: `- [ ] T### [P] [US#] Título` — `[P]` = paralelizable; `[MANUAL]` = lo hace una persona; `GATE` = comando de verificación que debe quedar en verde antes de seguir.

**Raíz del proyecto**: `/Users/jorgefdezsa/Sources/Netflix`. **Tests**: incluidos (constitución V y VI).

## Mapa de fases

| Fase | Contenido | Tareas | Ficha |
|---|---|---|---|
| P01 | Setup | T001–T010 | `phases/P01-setup.md` |
| P02 | Estilos base y lógica pura | T011–T020 | `phases/P02-styles-lib.md` |
| P03 | Datos del catálogo | T021–T034 | `phases/P03-data.md` |
| P04 | Estado y esqueleto de la app | T035–T049 | `phases/P04-state-app.md` |
| P05 | US1 Cabecera de navegación (P1) 🎯 MVP | T050–T059 | `phases/P05-us1-header.md` |
| P06 | US2 Título destacado (P1) | T060–T066 | `phases/P06-us2-hero.md` |
| P07 | US3 Filas de títulos (P1) | T067–T074 | `phases/P07-us3-rows.md` |
| P08 | US4 Tarjeta con previsualización (P1) | T075–T080 | `phases/P08-us4-preview.md` |
| P09 | US5 Detalle de título (P2) | T081–T090 | `phases/P09-us5-detail.md` |
| P10 | US6 Mi lista (P2) | T091–T095 | `phases/P10-us6-mylist.md` |
| P11 | US7 Búsqueda (P2) | T096–T104 | `phases/P11-us7-search.md` |
| P12 | US8 Selección de perfil (P3) | T105–T112 | `phases/P12-us8-profiles.md` |
| P13 | US9 Reproductor simulado (P3) | T113–T119 | `phases/P13-us9-player.md` |
| P14 | Pulido y comprobaciones finales | T120–T129 | `phases/P14-polish.md` |

## P01 · Setup

Ficha: `phases/P01-setup.md`

- [X] T001 Crear el proyecto Vite en la raíz
- [X] T002 Instalar dependencias
- [X] T003 Scripts de `package.json`
- [X] T004 Configurar Vitest en `vite.config.ts`
- [X] T005 `src/test/setup.ts`
- [X] T006 `tsconfig.app.json`
- [X] T007 [P] Tipos del dominio
- [X] T008 [P] Limpiar la plantilla
- [X] T009 [P] `index.html`
- [X] T010 GATE Setup

## P02 · Estilos base y lógica pura

Ficha: `phases/P02-styles-lib.md`

- [X] T011 `src/styles/tokens.css`
- [X] T012 `src/styles/global.css`
- [X] T013 [P] `storage`
- [X] T014 [P] `filterByProfile`
- [X] T015 [P] `searchTitles`
- [X] T016 [P] `rowsForView`
- [X] T017 [P] `itemsPerPage`
- [X] T018 [P] `formatDuration`
- [X] T019 [P] `similarTitles`
- [X] T020 GATE P02

## P03 · Datos del catálogo

Ficha: `phases/P03-data.md`

- [X] T021 [P] `src/data/profiles.json`
- [X] T022 [P] `src/data/notifications.json`
- [X] T023 [P] `src/data/titles-01.json`
- [X] T024 [P] `src/data/titles-02.json`
- [X] T025 [P] `src/data/titles-03.json`
- [X] T026 [P] `src/data/titles-04.json`
- [X] T027 [P] `src/data/titles-05.json`
- [X] T028 [P] `src/data/titles-06.json`
- [X] T029 [P] `src/data/rows.json`
- [X] T030 `src/data/catalog.ts`
- [X] T031 `src/data/catalog.test.ts`
- [X] T032 [P] `scripts/generate-placeholders.mjs`
- [X] T033 Generar activos
- [X] T034 GATE P03

## P04 · Estado y esqueleto de la app

Ficha: `phases/P04-state-app.md`

- [X] T035 `useProfile`
- [X] T036 Prueba de `useProfile`
- [X] T037 `useMyList`
- [X] T038 Prueba de `useMyList`
- [X] T039 `useTitleModal`
- [X] T040 `SafeImage`
- [X] T041 Prueba de `SafeImage`
- [X] T042 `AddToListButton`
- [X] T043 Prueba de `AddToListButton`
- [X] T044 `RootLayout`
- [X] T045 `routes.tsx`
- [X] T046 `App`
- [X] T047 `main.tsx`
- [X] T048 `renderWithProviders`
- [X] T049 GATE P04

## P05 · US1 Cabecera de navegación (P1) 🎯 MVP

Ficha: `phases/P05-us1-header.md`

- [X] T050 [P] [US1] `useScrolled`
- [X] T051 [P] [US1] `Header.module.css`
- [X] T052 [US1] `Header.tsx` (primera versión)
- [X] T053 [P] [US1] `NotificationsPanel`
- [X] T054 [P] [US1] `ProfileMenu`
- [X] T055 [US1] `Header.tsx` (añadir panel y menú)
- [X] T056 [P] [US1] `BrowsePage` (esqueleto)
- [X] T057 [US1] Rutas de navegación
- [X] T058 [US1] `Header.test.tsx`
- [X] T059 [US1] GATE US1

## P06 · US2 Título destacado (P1)

Ficha: `phases/P06-us2-hero.md`

- [X] T060 [P] [US2] `useReducedMotion`
- [X] T061 [P] [US2] `Hero.module.css`
- [X] T062 [US2] `Hero.tsx`
- [X] T063 [US2] `BrowsePage` con hero
- [X] T064 [US2] `Hero.test.tsx`
- [ ] T065 [MANUAL] [US2] Vídeo de muestra
- [X] T066 [US2] GATE US2

## P07 · US3 Filas de títulos (P1)

Ficha: `phases/P07-us3-rows.md`

- [ ] T067 [US3] `useCarousel`
- [ ] T068 [P] [US3] `TitleCard.module.css`
- [ ] T069 [US3] `TitleCard.tsx` (primera versión)
- [ ] T070 [P] [US3] `Row.module.css`
- [ ] T071 [US3] `Row.tsx`
- [ ] T072 [US3] `BrowsePage` con filas
- [ ] T073 [US3] `Row.test.tsx`
- [ ] T074 [US3] GATE US3

## P08 · US4 Tarjeta con previsualización (P1)

Ficha: `phases/P08-us4-preview.md`

- [ ] T075 [US4] `useHoverPreview`
- [ ] T076 [P] [US4] `CardPreview.module.css`
- [ ] T077 [US4] `CardPreview.tsx`
- [ ] T078 [US4] `TitleCard.tsx` con previsualización
- [ ] T079 [US4] `TitleCard.test.tsx`
- [ ] T080 [US4] GATE US4

## P09 · US5 Detalle de título (P2)

Ficha: `phases/P09-us5-detail.md`

- [ ] T081 [P] [US5] `useFocusTrap`
- [ ] T082 [P] [US5] `Modal.module.css`
- [ ] T083 [US5] `Modal.tsx`
- [ ] T084 [US5] `Modal.test.tsx`
- [ ] T085 [P] [US5] `TitleModal.module.css`
- [ ] T086 [US5] `TitleModal.tsx`
- [ ] T087 [P] [US5] `TitleModalHost`
- [ ] T088 [US5] `RootLayout` con host del modal
- [ ] T089 [US5] `TitleModal.test.tsx`
- [ ] T090 [US5] GATE US5

## P10 · US6 Mi lista (P2)

Ficha: `phases/P10-us6-mylist.md`

- [ ] T091 [P] [US6] `TitleGrid`
- [ ] T092 [US6] `MyListPage`
- [ ] T093 [US6] Ruta `/my-list`
- [ ] T094 [US6] `MyListPage.test.tsx`
- [ ] T095 [US6] GATE US6

## P11 · US7 Búsqueda (P2)

Ficha: `phases/P11-us7-search.md`

- [ ] T096 [P] [US7] `useDebouncedValue`
- [ ] T097 [P] [US7] `SearchBox.module.css`
- [ ] T098 [US7] `SearchBox.tsx`
- [ ] T099 [US7] `Header.tsx` con buscador
- [ ] T100 [US7] `SearchPage`
- [ ] T101 [US7] Ruta `/search`
- [ ] T102 [US7] `SearchBox.test.tsx`
- [ ] T103 [US7] `SearchPage.test.tsx`
- [ ] T104 [US7] GATE US7

## P12 · US8 Selección de perfil (P3)

Ficha: `phases/P12-us8-profiles.md`

- [ ] T105 [P] [US8] `ProfileGate`
- [ ] T106 [P] [US8] `ProfilesPage`
- [ ] T107 [P] [US8] `RequireProfile`
- [ ] T108 [P] [US8] `HomeRedirect`
- [ ] T109 [US8] Rutas con protección
- [ ] T110 [US8] `ProfileGate.test.tsx`
- [ ] T111 [US8] `BrowsePage.kids.test.tsx`
- [ ] T112 [US8] GATE US8

## P13 · US9 Reproductor simulado (P3)

Ficha: `phases/P13-us9-player.md`

- [ ] T113 [P] [US9] `usePlayerShortcuts`
- [ ] T114 [P] [US9] `Player.module.css`
- [ ] T115 [US9] `Player.tsx`
- [ ] T116 [P] [US9] `WatchPage`
- [ ] T117 [US9] Ruta `/watch/:id`
- [ ] T118 [US9] `Player.test.tsx`
- [ ] T119 [US9] GATE US9

## P14 · Pulido y comprobaciones finales

Ficha: `phases/P14-polish.md`

- [ ] T120 [P] README
- [ ] T121 Lint
- [ ] T122 [P] Imágenes solo con `SafeImage`
- [ ] T123 [P] Sin `any`
- [ ] T124 [MANUAL] Contraste
- [ ] T125 [MANUAL] Teclado
- [ ] T126 [MANUAL] Responsive
- [ ] T127 [MANUAL] Movimiento reducido
- [ ] T128 [MANUAL] Recorrido por historias
- [ ] T129 GATE FINAL

## Dependencias

| Fase | Depende de |
|---|---|
| P01 → P02 → P03 → P04 | en cadena (P04 bloquea todas las historias) |
| P05 US1 | P04 |
| P06 US2, P07 US3 | P05 (se montan en `BrowsePage`) |
| P08 US4 | P07 (amplía `TitleCard`) |
| P09 US5 | P07, P04 (`TitleModalHost` en `RootLayout`) |
| P10 US6 | P05, P07 |
| P11 US7 | P05, P10 (`TitleGrid`) |
| P12 US8 | P05 |
| P13 US9 | P04 |
| P14 Pulido | todas |

**Orden de ejecución**: P01 → P14 en orden numérico. `src/app/routes.tsx`, `src/pages/BrowsePage.tsx` y `src/components/Header/Header.tsx` se editan en varias fases: nunca en paralelo.

## Estrategia

- **MVP** = P01–P08 (las cuatro historias P1): ya es un `/browse` reconocible. Punto de corte para la demo en directo.
- Un commit por fase: `feat(PNN): …`. Cada GATE en verde antes de seguir (constitución VI).

## Trazabilidad

| Historia | Fase | Requisitos |
|---|---|---|
| US1 | P05 | FR-001–FR-004, FR-026, FR-027 |
| US2 | P06 | FR-005–FR-007 |
| US3 | P07 | FR-008–FR-010 |
| US4 | P08 | FR-011, FR-012 |
| US5 | P09 | FR-013–FR-015 |
| US6 | P10 | FR-016, FR-017 |
| US7 | P11 | FR-018, FR-019 |
| US8 | P12 | FR-020, FR-021 |
| US9 | P13 | FR-022, FR-023 |
| Transversal | P02–P04, P14 | FR-024, FR-025, SC-001–SC-008 |
