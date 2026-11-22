# Cómo usar Spec Kit con distintos agentes y modelos (locales y en la nube)

Guía para trabajar con este proyecto usando **Copilot CLI** o **Claude Code**, con el modelo en tu propio Mac (**oMLX**) o en la nube.

> **Regla de oro: nunca pongas una clave real en un fichero del repositorio, en un commit, en un PR ni en una captura.** Este repositorio es público. En esta guía todas las claves son marcadores como `<TU_API_KEY_OMLX>`; sustitúyelos en tu terminal o léelos de un almacén seguro, y no los pegues en ningún sitio compartido. Ver la sección 8.

## Qué verificó esta guía y qué no

Los comandos, flags y variables salen de la ayuda de cada herramienta (`--help`, `copilot help …`, `omlx launch --help`, `specify integration --help`) y del código de oMLX instalado, consultados en una máquina macOS con estas versiones:

| Herramienta | Versión consultada |
|---|---|
| Spec Kit (`specify`) | `1.2.2.dev0` |
| GitHub Copilot CLI (`copilot`) | `1.0.114` |
| Claude Code (`claude`) | `2.1.323` |
| oMLX (`omlx`) | `0.8.0` |

**No se ejecutó un comando de Spec Kit contra cada combinación de agente y modelo.** Las secciones 4 a 7 describen configuraciones correctas según la documentación de cada herramienta; si alguna variable cambia en tu versión, la ayuda de la propia herramienta manda (se indica cuál consultar en cada caso).

## 1. Las tres piezas

Spec Kit **no trae ningún modelo**. Son tres capas independientes:

```text
Spec Kit        →  los comandos /speckit-* (instrucciones en .github/skills/ y plantillas en .specify/)
   │
Agente          →  Copilot CLI, Claude Code… (lee esas instrucciones y las ejecuta)
   │
Modelo          →  en la nube (GitHub, Anthropic…) o local (oMLX en tu Mac)
```

Puedes cambiar el modelo sin tocar el agente, y el agente sin tocar los artefactos de Spec Kit. Combinaciones de esta guía:

| | Modelo local (oMLX) | Modelo en la nube |
|---|---|---|
| **Copilot CLI** | Sección 4 | Sección 7 |
| **Claude Code** | Sección 5 | Sección 6 |

## 2. Spec Kit y el agente

Este repositorio está inicializado con la integración `copilot` (ver `.specify/integration.json`). Los comandos están como *skills* en `.github/skills/speckit-*/SKILL.md` y se invocan como `/speckit-<nombre>` (`/speckit-specify`, `/speckit-clarify`, `/speckit-plan`, `/speckit-tasks`, `/speckit-implement`…). Copilot CLI descubre esos *skills* de las carpetas `.github/skills/`, `.agents/skills/` o `.claude/skills/` del proyecto:

```bash
copilot skill list          # qué skills detecta Copilot CLI en este proyecto
specify integration status  # integración activa y estado de sus ficheros
specify integration list    # todas las integraciones disponibles y cuáles están instaladas
```

### Usar Claude Code con el mismo proyecto

Hay que instalar la integración `claude` (Spec Kit coloca sus comandos donde Claude Code los busca). En `specify integration list`, `claude` figura como *multi-install safe* y `copilot` no:

```bash
specify integration install claude          # añadir claude (si lo permite la tabla de arriba)
specify integration install claude --force  # forzar la convivencia con copilot
specify integration switch claude           # o sustituir copilot por claude
specify integration use claude              # fijar claude como integración por defecto
specify integration status                  # comprobar el resultado
```

Esto **modifica ficheros del repositorio** (`.specify/` y la carpeta de comandos de esa integración): haz commit antes y revisa el `git diff` después. `specify integration install --help` y `specify integration switch --help` documentan las opciones (`--force`, `--script`, `--refresh-shared-infra`…).

## 3. Preparar oMLX (modelo local)

[oMLX](https://github.com/jundot/omlx) es un servidor de inferencia para Apple Silicon que expone una API compatible con OpenAI (`/v1`) y con Anthropic. Escucha por defecto en `127.0.0.1:8000`.

```bash
omlx start                 # arranca el servidor gestionado en segundo plano
omlx stop                  # lo detiene (omlx restart para reiniciarlo)
omlx serve --port 8000     # alternativa: en primer plano, para ver los registros
```

- Los modelos se descubren en subcarpetas de `~/.omlx/models` (cada una con `config.json` y `*.safetensors`); el nombre de la carpeta es el *id* del modelo. Otra carpeta: `--model-dir`.
- Si el servidor tiene **clave de API activada** (lo habitual), toda petición sin ella devuelve `401`. La clave se fija con `--api-key` o en los ajustes de oMLX. Para que los comandos de esta guía la tomen sin escribirla ni imprimirla:

```bash
# Léela del fichero de ajustes de oMLX a una variable de entorno de ESTA terminal.
# No uses `echo $OMLX_API_KEY` ni `set -x`, y no la copies a ningún fichero del repo.
export OMLX_API_KEY="$(python3 -c "import json,os;print(json.load(open(os.path.expanduser('~/.omlx/settings.json')))['auth']['api_key'])")"

# Comprobar que el servidor responde y qué modelos ofrece (solo imprime la lista de ids):
curl -s -H "Authorization: Bearer $OMLX_API_KEY" http://127.0.0.1:8000/v1/models | python3 -c "import json,sys;print([m['id'] for m in json.load(sys.stdin)['data']])"
```

Si la ruta o la estructura de tu `settings.json` es distinta, copia la clave desde la aplicación de oMLX directamente a la variable, sin pasarla por el historial del shell.

**Importante con modelos locales: el contexto es pequeño.** Un modelo local suele manejar bastante menos contexto que uno en la nube (en una configuración típica, 40.000–50.000 tokens de entrada). Por eso este proyecto se preparó para modelos pequeños (principio VIII de la constitución): el agente solo necesita leer `specs/001-netflix-browse/IMPLEMENT.md` y **una** ficha `phases/PNN-*.md` por ejecución, cada una de menos de 7 KB. Trabaja fase a fase y no le pidas que lea `spec.md`, `plan.md` o `tasks.md` completos.

## 4. Copilot CLI + oMLX (modelo local)

Copilot CLI admite modelos propios (BYOK). Para un servidor OpenAI-compatible como oMLX, se declara un *proveedor* de tipo `openai` en un fichero de proveedores. Referencia oficial: `copilot help providers-local` y <https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/use-byok-models>.

### Opción A: lo más rápido, con el lanzador de oMLX

```bash
omlx launch list                         # herramientas que oMLX sabe configurar (copilot, claude…)
omlx launch copilot --model <ID_MODELO>  # configura y abre Copilot CLI contra el oMLX local
```

`omlx launch` toma host, puerto y clave de la configuración de oMLX; no tienes que pasar la clave. Sin `--model`, te deja elegir.

### Opción B: un fichero de proveedores propio (modelos fijos y límites de contexto)

Estructura (el fichero se indica con `COPILOT_PROVIDERS_CONFIG`; por defecto es `$COPILOT_HOME/providers.json`, es decir `~/.copilot/providers.json`):

```json
{
  "providers": [
    { "name": "omlx", "type": "openai", "baseUrl": "http://127.0.0.1:8000/v1", "apiKey": "<TU_API_KEY_OMLX>" }
  ],
  "models": [
    { "id": "<ID_MODELO>", "provider": "omlx", "maxPromptTokens": 50000, "maxOutputTokens": 16000 }
  ]
}
```

- `maxPromptTokens` debe coincidir con el contexto real que aguanta tu servidor y tu RAM libre; si te pasas, el servidor falla o se queda sin memoria.
- **No dejes la clave escrita en un fichero permanente.** Un patrón seguro es generar el fichero **temporal** en cada arranque, con permisos `600`, leyendo la clave de oMLX, y borrarlo al salir:

```bash
#!/bin/bash
# copilot-local.sh — arranca Copilot CLI contra oMLX sin dejar la clave en disco.
CFG=$(mktemp -t copilot-omlx) || exit 1
chmod 600 "$CFG"
trap 'rm -f "$CFG"' EXIT INT TERM

python3 - "$CFG" <<'PY' || exit 1
import json, os, sys
key = json.load(open(os.path.expanduser('~/.omlx/settings.json')))['auth']['api_key']
cfg = {
  "providers": [{"name": "omlx", "type": "openai", "baseUrl": "http://127.0.0.1:8000/v1", "apiKey": key}],
  "models": [{"id": "<ID_MODELO>", "provider": "omlx", "maxPromptTokens": 50000, "maxOutputTokens": 16000}],
}
json.dump(cfg, open(sys.argv[1], 'w'))
PY

export COPILOT_PROVIDERS_CONFIG="$CFG"
export COPILOT_OFFLINE=true      # sin red: ni GitHub, ni telemetría, ni web (ver nota)

copilot --model "omlx/<ID_MODELO>" "$@"
```

El modelo se elige como `omlx/<ID_MODELO>` (proveedor + id) con `--model` o, dentro de la sesión, con `/model`.

### Opción C: una sola ejecución, solo con variables de entorno

```bash
export COPILOT_PROVIDER_BASE_URL="http://127.0.0.1:8000/v1"
export COPILOT_PROVIDER_TYPE=openai                 # openai | azure | anthropic | google
export COPILOT_PROVIDER_API_KEY="$OMLX_API_KEY"     # ver sección 3; o COPILOT_PROVIDER_API_KEY_COMMAND
export COPILOT_MODEL="<ID_MODELO>"
export COPILOT_OFFLINE=true
copilot
```

`COPILOT_PROVIDER_API_KEY_COMMAND` es un comando que **imprime la clave en cada petición** (útil con gestores de contraseñas y para no tenerla en una variable fija). Todas las variables están documentadas en `copilot help environment`.

### Notas sobre Copilot CLI con modelos locales

- `COPILOT_OFFLINE=true` exige un proveedor local y **desactiva** el inicio de sesión de GitHub, las herramientas web, el servidor MCP de GitHub, la telemetría y las actualizaciones. Si necesitas esas funciones, no lo actives.
- No está disponible la selección automática de modelo (*Auto*), ni las funciones que corren en servidores de GitHub (agente en la nube, revisión de código, sesiones remotas).
- GitHub no cobra por modelos propios; pagas solo a tu proveedor (aquí, nada).
- **Permisos de herramientas.** Copilot pregunta antes de ejecutar comandos o escribir ficheros. Si quieres trabajar sin tantas confirmaciones pero sin permitir lo peligroso, permite lo necesario y deniega lo destructivo o lo que publica:

```bash
copilot --model "omlx/<ID_MODELO>" \
  --allow-tool='shell' --allow-tool='write' \
  --deny-tool='shell(git push)' --deny-tool='shell(git reset)' --deny-tool='shell(rm -rf)'
```

  Evita `--allow-all` y `COPILOT_ALLOW_ALL`: aprueban todo, incluido `git push`.

### Ejecutar Spec Kit con este modelo

```text
copilot> /speckit-analyze      # (opcional) revisar consistencia spec ↔ plan ↔ tasks
copilot> Implementa la fase P05: lee specs/001-netflix-browse/IMPLEMENT.md y
         specs/001-netflix-browse/phases/P05-us1-header.md y sigue sus tareas en orden.
```

Con modelos locales pequeños, conviene **una fase por sesión** y empezar sesión nueva en la siguiente.

## 5. Claude Code + oMLX (modelo local)

oMLX habla el protocolo de Anthropic, así que Claude Code puede usarlo cambiando la URL base.

### Opción A: con el lanzador de oMLX (recomendado)

```bash
omlx launch claude --model <ID_MODELO>
# Claude Code usa «niveles» de modelo (opus / sonnet / haiku); puedes asignar uno local a cada uno:
omlx launch claude --opus <ID_GRANDE> --sonnet <ID_MEDIANO> --haiku <ID_PEQUENO>
```

oMLX prepara el entorno **solo del proceso que lanza** (no queda nada exportado en tu shell) y lo configura para que Claude Code no mande tráfico no esencial a Anthropic (`--cross-session` lo reactiva si necesitas la mensajería entre sesiones).

### Opción B: a mano, con variables de entorno

Son las que configura `omlx launch` (nombres tomados de su código):

```bash
export ANTHROPIC_BASE_URL="http://127.0.0.1:8000"        # sin /v1: Claude Code lo añade
export ANTHROPIC_AUTH_TOKEN="$OMLX_API_KEY"              # la clave de oMLX (sección 3)
export ANTHROPIC_MODEL="<ID_MODELO>"
export ANTHROPIC_DEFAULT_SONNET_MODEL="<ID_MODELO>"      # opcional: también ..._OPUS_... y ..._HAIKU_...
export CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1        # evita tráfico no esencial hacia Anthropic
export API_TIMEOUT_MS=3000000                            # los modelos locales tardan en cargar y generar
claude
```

Si lo haces a mano, **desactiva esas variables al terminar** (`unset ANTHROPIC_BASE_URL ANTHROPIC_AUTH_TOKEN ANTHROPIC_MODEL …`) o abre la sesión en una terminal aparte; si no, tu próximo `claude` seguirá yendo al servidor local sin que lo notes.

### Spec Kit con Claude Code

Instala antes la integración `claude` (sección 2). Después, dentro de `claude`, usa los mismos `/speckit-*`. Con modelo local, aplica la misma regla de la sección 4: una fase por sesión, leyendo solo `IMPLEMENT.md` y la ficha de esa fase.

## 6. Claude Code como modelo en la nube (Anthropic)

```bash
claude auth login      # inicia sesión con tu cuenta de Anthropic (abre el navegador)
claude auth status     # comprobar quién eres y cómo estás autenticado
claude                 # sesión interactiva
claude --model <ALIAS_O_ID>        # elegir modelo para la sesión (también /model dentro)
claude -p "tu instrucción"         # modo no interactivo: imprime la respuesta y sale
```

- **Autenticación.** Lo normal es `claude auth login`. Alternativamente, una clave de API de Anthropic en `ANTHROPIC_API_KEY` (`export ANTHROPIC_API_KEY="<TU_API_KEY_ANTHROPIC>"`), que factura por uso; no la pongas en ningún fichero del repo.
- **Que no haya restos de la configuración local.** Si antes usaste oMLX a mano, comprueba que no quedan `ANTHROPIC_BASE_URL`, `ANTHROPIC_AUTH_TOKEN` ni `ANTHROPIC_MODEL` exportadas: harían que `claude` hablase con el servidor local en vez de con Anthropic (`env | grep -c '^ANTHROPIC_'` debe dar `0`; no imprimas su contenido).
- **Modelo de reserva:** `claude --fallback-model <ID1>,<ID2>` prueba los modelos indicados, por orden, si el principal está sobrecargado o no disponible (reintenta el principal al inicio de cada turno).
- **Uso sin supervisión (scripts, CI):** `claude -p` con `--permission-mode` explícito. No uses `--dangerously-skip-permissions` salvo en un entorno aislado y desechable.
- `claude --help` lista todas las opciones de tu versión.

Con el modelo en la nube el contexto es amplio, así que puedes usar el flujo completo de Spec Kit (`/speckit-specify` → `/speckit-clarify` → `/speckit-plan` → `/speckit-tasks` → `/speckit-implement`) sin trocear por fases.

## 7. Copilot CLI con modelos en la nube

```bash
copilot login          # inicia sesión con tu cuenta de GitHub (necesita suscripción a Copilot)
copilot                # sesión interactiva
copilot --model <ID>   # elegir modelo; dentro de la sesión, /model lista los disponibles
copilot -p "instrucción"   # modo no interactivo (con -p / --prompt)
```

- **Modelos de GitHub.** `/model` muestra los que tu suscripción y tu organización permiten. Para fijar uno por defecto: `/config model` dentro de la sesión, o `COPILOT_MODEL=<ID>`.
- **Token en vez de inicio de sesión interactivo** (scripts, CI): `COPILOT_GITHUB_TOKEN`, `GH_TOKEN` o `GITHUB_TOKEN`, en ese orden de precedencia. Usa el almacén de secretos de tu CI; nunca lo pegues en un fichero.
- **Modelos de otro proveedor en la nube (BYOK).** Las mismas variables `COPILOT_PROVIDER_*` de la sección 4 sirven para un proveedor en la nube; cambia el tipo y la URL (`COPILOT_PROVIDER_TYPE` admite `openai`, `azure`, `anthropic` y `google`, este último experimental; `COPILOT_PROVIDER_WIRE_API=responses` para modelos de la serie GPT-5). Pasa la clave con `COPILOT_PROVIDER_API_KEY_COMMAND` (mejor) o `COPILOT_PROVIDER_API_KEY`.
- **No actives `COPILOT_OFFLINE`** si quieres modelos de GitHub, herramientas web o el servidor MCP de GitHub: lo desactiva todo.
- **En VS Code** (Copilot Chat), los *skills* de `.github/skills/` se detectan igual y se usan los modelos de tu suscripción. No se ha verificado en esta guía el uso de modelos locales desde VS Code; para modelos locales usa Copilot CLI (sección 4).

## 8. Seguridad de las claves

- **El repositorio es público.** Antes de cada commit: `git diff --cached | grep -iE "api[_-]?key|token|secret|bearer"` debe salir vacío (o solo marcadores como `<TU_API_KEY_…>`).
- **Permisos 600 y borrado al salir** para cualquier fichero temporal con una clave (ver el script de la sección 4).
- **Prefiere** `COPILOT_PROVIDER_API_KEY_COMMAND`, el llavero de macOS o un gestor de contraseñas a variables fijas en `~/.zshrc`.
- **No imprimas claves**: ni `echo`, ni `set -x`, ni `env` completo en capturas, issues o PRs. Los registros de oMLX con nivel `trace` incluyen el contenido completo de los mensajes; no los compartas.
- **Servidor local solo en local:** oMLX escucha por defecto en `127.0.0.1`. No lo expongas con `--host 0.0.0.0` sin clave y sin saber quién puede llegar a ese puerto.
- **Si una clave se filtra:** rótala (créala de nuevo en oMLX, Anthropic o GitHub) antes de intentar borrar el commit: el historial público de git la conserva.

## 9. Problemas frecuentes

| Síntoma | Causa probable | Qué hacer |
|---|---|---|
| `401` al llamar a `localhost:8000` | oMLX exige clave y no la envías | Exporta `OMLX_API_KEY` (sección 3) y úsala |
| `Connection refused` en `:8000` | El servidor oMLX no está arrancado | `omlx start` (o `omlx serve`) |
| Copilot no lista tu modelo en `/model` | El `id` no coincide con el de `/v1/models`, o falta reiniciar `copilot` tras editar el fichero de proveedores | Compara los ids y reinicia |
| Respuestas cortadas o error de contexto | `maxPromptTokens` por encima de lo que aguanta el servidor, o falta RAM libre | Baja `maxPromptTokens` y trabaja una fase por sesión |
| `copilot` pide iniciar sesión con `COPILOT_OFFLINE=true` | No hay proveedor local válido cargado | Revisa `COPILOT_PROVIDERS_CONFIG`, o usa `COPILOT_PROVIDER_BASE_URL` |
| `claude` sigue yendo al modelo local | Quedaron `ANTHROPIC_*` exportadas | `unset` de esas variables (sección 6) |
| `/speckit-*` no aparece en Claude Code | Falta instalar la integración `claude` | `specify integration install claude` (sección 2) |
| `ollama` no responde | Es un servidor distinto de oMLX y no está en marcha | `ollama serve`; Copilot CLI lo detecta solo en `127.0.0.1:11434` |

## 10. Dónde ampliar

- Copilot CLI: `copilot help providers`, `copilot help providers-local`, `copilot help environment`.
- oMLX: `omlx --help`, `omlx serve --help`, `omlx launch --help`.
- Claude Code: `claude --help`, `claude auth --help`.
- Spec Kit: `specify integration --help` y <https://github.com/github/spec-kit>.
- Historial de comandos de Spec Kit usados en este proyecto: [`specs/001-netflix-browse/README.md`](../specs/001-netflix-browse/README.md).
