# Historial de Spec Kit en este proyecto

Qué comandos de [Spec Kit](https://github.com/github/spec-kit) se usaron para construir `001-netflix-browse`, en qué orden, qué produjo cada uno y qué comandos instalados **no** se usaron.

> **Cómo leer este documento.** Los prompts y argumentos exactos con los que se lanzaron los comandos **no se conservan** en el repositorio: el registro de la sesión de Claude Code de esos días (`~/.claude/projects/…/5d636624-….jsonl`) solo contiene un `/model`. Por eso la cronología está **reconstruida a partir de los artefactos, las fechas de los ficheros y los commits**. Cada fila indica su evidencia; el comando concreto es una inferencia razonable, no un registro literal. Lo que consta de forma directa se marca como *Confirmado*.

## 1. Cómo está instalado Spec Kit

*Confirmado* en `.specify/init-options.json` e `.specify/integration.json`:

| Ajuste | Valor |
|---|---|
| Versión de Spec Kit | `1.2.2.dev0` |
| Integración / agente | `copilot` (con `ai_skills: true`) |
| Scripts | `sh` (`.specify/scripts/bash/`) |
| Numeración de features | `sequential` (`001-…`) |
| Inicializado en el directorio actual | `here: true` |
| Separador de invocación | `-` → los comandos se llaman `/speckit-<nombre>` |

Qué añadió la inicialización (commit `06c0b13`, 21 nov 2026, 30 ficheros):

- `.github/skills/speckit-*/SKILL.md`: los 10 comandos como *skills* (ver sección 4).
- `.specify/scripts/bash/`: `check-prerequisites.sh`, `common.sh`, `create-new-feature.sh`, `resolve-template.sh`, `setup-plan.sh`, `setup-tasks.sh`.
- `.specify/templates/`: plantillas de constitución, spec, plan, tasks y checklist.
- `.specify/workflows/speckit/workflow.yml`: el flujo "Full SDD Cycle" (`specify → plan → tasks → implement`, con puertas de revisión entre pasos). **No consta que se ejecutara como flujo**; se trabajó comando a comando.
- `.specify/memory/constitution.md` y `.specify/feature.json` (apunta a `specs/001-netflix-browse`).

## 2. Cronología de comandos

Fechas de commit en UTC; las de ficheros, hora local.

| # | Cuándo | Comando (inferido) | Qué produjo | Evidencia |
|---|---|---|---|---|
| 1 | 21 nov, ~15:36 | `specify init` (`--here`, integración `copilot`, scripts `sh`) | Todo el andamiaje de la sección 1 | *Confirmado*: `init-options.json`; fecha de los ficheros de `.specify` y `.github/skills` |
| 2 | 21 nov, antes de las 16:22 | `/speckit-constitution` | `.specify/memory/constitution.md` **v1.0.0** con los principios I–VII (Demo Scope, Fixed Stack, Accessibility, Responsive Mobile-First, Quality and Testability, Incremental Delivery, Simplicity) | *Confirmado*: commit `06c0b13` «init spec kit with constitution v1.0.0» y el informe «Sync Impact Report» de la constitución |
| 3 | 21 nov, antes de las 17:37 | `/speckit-specify` | `specs/001-netflix-browse/spec.md` y `checklists/requirements.md` (lista de calidad de la spec) | *Inferido*: es el comando que crea la spec y esa checklist de validación; `feature.json` apunta a la feature |
| 4 | 21 nov (sesión «2026-11-21») | `/speckit-clarify` | Sección **Clarifications** de `spec.md` con 4 preguntas y respuestas: perfil Infantil = `TP` y `7+`; un único vídeo para hero y reproductor; Series/Películas/Novedades filtran el inicio; notificaciones = panel con 3 avisos estáticos | *Confirmado*: la sección existe con fecha «Session 2026-11-21»; la checklist indica «No [NEEDS CLARIFICATION] markers remain» |
| 5 | 21 nov, antes de las 17:37 | `/speckit-plan` | `plan.md`, `research.md`, `data-model.md`, `contracts/` (`hooks.md`, `routes.md`, `types.ts`) y `quickstart.md` | *Confirmado*: `plan.md` dice «filled in by the `/speckit-plan` command»; commit `e65eb67` |
| 6 | 21 nov, antes de las 17:37 | `/speckit-tasks` | `tasks.md` | *Inferido*: es el comando que lo genera; commit `e65eb67` «constitution, spec, plan y tasks» |
| 7 | 22 nov, 00:04 | Regeneración «para modelo local» (comandos exactos no consta cuáles) + `/speckit-constitution` | Constitución **v1.1.0** (principio VIII «Small-Model Friendly Artifacts»); `IMPLEMENT.md`; 14 fichas `phases/P01…P14`; `contracts/testids.md`; `tasks.md` convertido en índice con casillas | *Confirmado*: commit `9c1826c` «regenerar artefactos para modelo local (fichas por fase, IMPLEMENT.md)» y el informe de la constitución (1.0.0 → 1.1.0) |

### Intento descartado (22 nov, 15:32–15:38)

Los ficheros de la feature se volvieron a regenerar en el directorio de trabajo (fecha de `feature.json`: 15:32; `spec.md`, `plan.md`, `research.md`, `data-model.md`, `quickstart.md` y `contracts/`: 15:33–15:34) y la constitución volvió a la v1.0.0 (15:38). Eso dejó sin generar `tasks.md`, `IMPLEMENT.md`, `phases/` y `contracts/testids.md`, y **nunca se hizo commit**. A petición, se descartó con `git restore --staged --worktree .`, y el repositorio volvió al estado del commit `9c1826c`. Lo regenerado ese día **no se puede recuperar**.

## 3. Implementación: no se usó `/speckit-implement`

Las 14 fases se implementaron **a mano**, siguiendo el procedimiento que el propio Spec Kit dejó escrito en `IMPLEMENT.md` más la ficha de cada fase (`phases/PNN-*.md`), y **no** con `/speckit-implement`. Cada tarea se marcó en `tasks.md` (`- [X] T###`), las desviaciones respecto a las fichas se anotaron en `NOTES.md`, y cada fase terminó con su puerta (`npm run typecheck && npm test && npm run build`) y un commit:

| Fase | Contenido | Commit |
|---|---|---|
| P01 | Setup (Vite, React 18, Vitest) | `efcd520` |
| P02 | Estilos base y lógica pura | `cc34179` |
| P03 | Catálogo y activos | `5489267` |
| P04 | Estado y esqueleto | `9ead9af` |
| P05 | Cabecera | `5c34211` |
| P06 | Hero | `ff40a34` |
| P07 | Filas | `bc20d12` |
| P08 | Previsualización | `2a63f61` |
| P09 | Detalle | `795e254` |
| P10 | Mi lista | `f3a8633` |
| P11 | Búsqueda | `e53a43c` |
| P12 | Perfiles | `9c450cb` |
| P13 | Reproductor | `e054eb4` |
| P14 | Pulido | `12d7021` |

Tareas que siguen sin marcar (son manuales): `T065` (vídeo de muestra) y `T124`–`T128` (contraste, teclado, responsive, movimiento reducido y recorrido por historias).

## 4. Comandos instalados que no se usaron

Hay 10 *skills* en `.github/skills/`. Para estos **no hay rastro de uso** en los artefactos ni en el historial:

| Comando | Para qué sirve | Por qué consta como no usado |
|---|---|---|
| `/speckit-analyze` | Análisis de consistencia entre spec, plan y tasks | No hay informe de análisis en `specs/` |
| `/speckit-checklist` | Checklists de calidad de requisitos a medida | Solo existe `checklists/requirements.md`, que genera `/speckit-specify` |
| `/speckit-converge` | Reconciliar artefactos entre sí | Sin rastro |
| `/speckit-implement` | Ejecutar las tareas de `tasks.md` | Ver sección 3: se implementó a mano |
| `/speckit-taskstoissues` | Convertir las tareas en *issues* de GitHub (**obsoleto** en esta versión: lo sustituye `/speckit-github-taskstoissues`, de la extensión `github`) | El repositorio no tiene issues ni PRs (comprobado en modo solo lectura con `gh issue list` y `gh pr list`) |

## 5. Llamadas a GitHub

- **No consta ninguna llamada de Spec Kit a GitHub.** El único comando que las haría es `/speckit-taskstoissues` (obsoleto), que lee y crea *issues* mediante las herramientas del servidor MCP de GitHub; no se usó (sección 4). Los *scripts* de `.specify/scripts/bash/` no contienen `gh`, `curl`, `wget` ni `git push/fetch/pull/remote` (comprobado con `grep`).
- **Remoto:** `origin` → `https://github.com/jorgefdezsa/NetflixClone.git`.
- **Rama publicada:** existe `origin/001-netflix-browse`, ahora mismo en `12d7021` (el último commit de P14). Un `git push` publica la rama; no es una llamada de Spec Kit.
- **Pull requests:** ninguno abierto.

## 6. Cómo seguir con Spec Kit

```text
/speckit-analyze        # comprobar la consistencia entre spec, plan y tasks
/speckit-taskstoissues  # obsoleto; la alternativa es `specify extension add github` y luego `/speckit-github-taskstoissues`
```

El resto de la documentación de la feature está en esta carpeta: `spec.md`, `plan.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`, `tasks.md`, `IMPLEMENT.md`, `phases/` y `NOTES.md`.
