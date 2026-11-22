# IMPLEMENT — guía única para quien implementa

Lee **solo este fichero** y **la ficha de fase** que te indiquen (`phases/PNN-*.md`). No leas `spec.md`, `plan.md`, `research.md` ni `tasks.md` completos: cada ficha ya contiene lo necesario.

## 1. Bucle de trabajo (repítelo por cada tarea)

1. Abre la ficha `T###` en la fase indicada.
2. Crea o edita **solo** los ficheros que nombra la ficha. Si debes editar uno existente, léelo antes.
3. Comprueba los criterios de **Hecho cuando**. Para tareas con prueba: `npx vitest run <fichero>`.
4. Marca la tarea en `specs/001-netflix-browse/tasks.md` cambiando `- [ ] T###` por `- [X] T###` (edita solo esa línea; no leas el fichero entero).
5. Pasa a la siguiente. En una tarea **GATE**: ejecuta el comando, corrige hasta que esté en verde y **para**.

## 2. Reglas duras

| # | Regla |
|---|---|
| R1 | Una tarea cada vez, en orden. No adelantes trabajo de otras tareas. |
| R2 | Usa **exactamente** los nombres de props, funciones, rutas y `data-testid` de la ficha. |
| R3 | No instales dependencias ni crees ficheros que la ficha no mencione. |
| R4 | Raíz del proyecto: `/Users/jorgefdezsa/Sources/Netflix` (no en subcarpetas). Rutas de las fichas relativas a ella. |
| R5 | Textos de interfaz en español (es-ES); identificadores en inglés. |
| R6 | TypeScript estricto, sin `any`. Componentes: `export default function Nombre`. Hooks y funciones puras: export con nombre. |
| R7 | Estilos solo con CSS Modules (`import styles from './X.module.css'`) y variables de `src/styles/tokens.css`. Nada de estilos en línea salvo variables CSS. |
| R8 | Imágenes: usa siempre `SafeImage` (T040). Nunca `<img>` directo. |
| R9 | Pruebas: selecciona **solo con `data-testid`** (`getByTestId`, `queryAllByTestId`). `role` y `aria-*` se comprueban con `toHaveAttribute`. |
| R10 | Si la ficha y tu intuición discrepan, gana la ficha. Si algo no encaja, escribe la duda en `specs/001-netflix-browse/NOTES.md` y sigue con lo que sí se puede hacer. |
| R11 | Termina cada fase con su GATE en verde antes de empezar la siguiente. Haz un commit por fase: `feat(PNN): …`. |

## 3. Comandos

| Para | Comando |
|---|---|
| Tipos | `npm run typecheck` |
| Todas las pruebas | `npm test` |
| Una prueba | `npx vitest run src/ruta/Fichero.test.tsx` |
| Compilar | `npm run build` |
| **Puerta de fase** | `npm run typecheck && npm test && npm run build` |

## 4. Plantillas (cópialas y adapta)

**Prueba de componente** (usa el ayudante de T048):

```tsx
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/renderWithProviders';
import Header from './Header';

it('muestra la cabecera', () => {
  renderWithProviders(<Header />, { profileId: 'p-1' });
  expect(screen.getByTestId('app-header')).toBeInTheDocument();
});
```

**Prueba con teclado o ratón**:

```tsx
import userEvent from '@testing-library/user-event';
const user = userEvent.setup();
await user.click(screen.getByTestId('notifications-toggle'));
await user.keyboard('{Escape}');
```

**Prueba de hook con temporizadores**: `vi.useFakeTimers()` en `beforeEach` y `vi.useRealTimers()` en `afterEach`; avanza con `act(() => { vi.advanceTimersByTime(400); })`.

**Módulo CSS**: crea `X.module.css` junto al componente; clases en `camelCase`.

## 5. Estructura de carpetas (resumen)

```text
src/app/        RootLayout, App, routes, RequireProfile, HomeRedirect
src/types/      index.ts
src/data/       *.json + catalog.ts
src/lib/        funciones puras (+ .test.ts)
src/hooks/      hooks (+ .test)
src/components/ <Nombre>/<Nombre>.tsx + .module.css + .test.tsx
src/pages/      páginas
src/styles/     tokens.css, global.css
src/test/       setup.ts, renderWithProviders.tsx
public/assets/  posters, banners, avatars, video, placeholder.svg
```

## 6. Mapa de fases

| Fase | Fichero | Tareas |
|---|---|---|
| P01 Setup | `phases/P01-setup.md` | T001–T010 |
| P02 Estilos y lógica pura | `phases/P02-styles-lib.md` | T011–T020 |
| P03 Datos | `phases/P03-data.md` | T021–T034 |
| P04 Estado y app | `phases/P04-state-app.md` | T035–T049 |
| P05 US1 Cabecera | `phases/P05-us1-header.md` | T050–T059 |
| P06 US2 Hero | `phases/P06-us2-hero.md` | T060–T066 |
| P07 US3 Filas | `phases/P07-us3-rows.md` | T067–T074 |
| P08 US4 Previsualización | `phases/P08-us4-preview.md` | T075–T080 |
| P09 US5 Detalle | `phases/P09-us5-detail.md` | T081–T090 |
| P10 US6 Mi lista | `phases/P10-us6-mylist.md` | T091–T095 |
| P11 US7 Búsqueda | `phases/P11-us7-search.md` | T096–T104 |
| P12 US8 Perfiles | `phases/P12-us8-profiles.md` | T105–T112 |
| P13 US9 Reproductor | `phases/P13-us9-player.md` | T113–T119 |
| P14 Pulido | `phases/P14-polish.md` | T120–T129 |
