# P03 · Datos del catálogo (T021–T034)

**Objetivo**: 60 títulos, 11 filas, 4 perfiles, 3 avisos y activos SVG generados.
**Requisito previo**: P02 en verde. Tipos en `src/types/index.ts`.
**Regla de oro**: los ids deben ser **exactos** (`t-001`…`t-060`); las filas los referencian. Nombres y reparto **ficticios**; textos en español.

## Ejemplo de película (copia el formato)
```json
{
  "id": "t-001", "type": "movie", "name": "Cruce de Fuego",
  "synopsis": "Una agente retirada vuelve para detener un atraco imposible.",
  "year": 2025, "rating": "16+", "durationMinutes": 112,
  "genres": ["Acción"], "cast": ["Lucía Vera", "Mario Ortega"],
  "poster": "/assets/posters/t-001.svg", "banner": "/assets/banners/t-001.svg",
  "addedAt": "2026-08-14"
}
```

## Ejemplo de serie
```json
{
  "id": "t-031", "type": "series", "name": "La Casa del Faro",
  "synopsis": "Tres hermanos heredan un faro con un secreto.",
  "year": 2024, "rating": "12+",
  "seasons": [
    { "number": 1, "episodes": [
      { "number": 1, "name": "Herencia", "synopsis": "Llegan al faro.", "durationMinutes": 45 },
      { "number": 2, "name": "Marea", "synopsis": "Aparece una carta.", "durationMinutes": 48 },
      { "number": 3, "name": "Niebla", "synopsis": "Un visitante inesperado.", "durationMinutes": 44 }
    ] },
    { "number": 2, "episodes": [ "…3 episodios más, numerados 1–3" ] }
  ],
  "genres": ["Drama"], "cast": ["Elena Ruiz"],
  "poster": "/assets/posters/t-031.svg", "banner": "/assets/banners/t-031.svg",
  "addedAt": "2026-05-02"
}
```
(En el fichero real, la temporada 2 lleva 3 episodios completos, no texto.)

## Tabla de ficheros de títulos

| Tarea | Fichero | Ids | Tipo | Géneros | `rating` |
|---|---|---|---|---|---|
| T023 | `titles-01.json` | t-001–t-010 | movie | Acción, Aventura | `12+` y `16+` |
| T024 | `titles-02.json` | t-011–t-020 | movie | Comedia, Familia, Animación | `TP` y `7+` |
| T025 | `titles-03.json` | t-021–t-030 | movie | Drama, Suspense | `12+`, `16+`, `18+` |
| T026 | `titles-04.json` | t-031–t-040 | series | Drama | `12+` y `16+` |
| T027 | `titles-05.json` | t-041–t-050 | series | Comedia, Animación | `TP` y `7+` |
| T028 | `titles-06.json` | t-051–t-060 | series | Suspense, Ciencia ficción | `12+`, `16+`, `18+` |

**Reglas comunes**: array JSON con 10 objetos; películas con `durationMinutes` 80–150; series con 2 temporadas × 3 episodios (`durationMinutes` 40–55); sin campo `logo`; `year` 2018–2026.
**`addedAt` reciente** (≥ `2026-10-01`) **solo** en: t-006–t-010, t-036–t-040, t-046–t-050, t-051–t-056. El resto, anterior a `2026-10-01`.

## T021 · `src/data/profiles.json` [P]
- Array de 4: `{ "id": "p-1", "name": "Jorge", "avatar": "/assets/avatars/p-1.svg", "isKids": false }`, `p-2` Ana, `p-3` Marcos (`isKids: false`) y `p-4` "Infantil" (`isKids: true`).

## T022 · `src/data/notifications.json` [P]
- 3 avisos `{ "id": "n-1", "text": "…", "date": "Hoy" }` hasta `n-3` (p. ej. "Nueva temporada disponible", "Tu lista tiene novedades", "Recomendado para ti").

## T023–T028 · `src/data/titles-01.json` … `titles-06.json` [P]
- Una tarea por fichero, según la tabla de arriba. Crea solo el fichero de la tarea.
- **Hecho cuando**: el JSON es válido (`node -e "JSON.parse(require('fs').readFileSync('src/data/titles-01.json','utf8'))"`) y tiene 10 elementos con los ids esperados.

## T029 · `src/data/rows.json` [P]
- Array de 11 filas `{ id, name, kind, views, titleIds }` con los ids **expandidos**:

| id | name | kind | views | titleIds |
|---|---|---|---|---|
| r-trending | Tendencias | standard | home | t-001–t-004, t-011–t-014, t-031–t-034 |
| r-top10 | Top 10 en España | top10 | home | t-001, t-031, t-011, t-021, t-032, t-002, t-041, t-012, t-022, t-033 |
| r-because | Porque has visto… | standard | home | t-021–t-030 |
| r-series | Series de TV | standard | home, series | t-031–t-040 |
| r-action | Películas de acción | standard | home, movies | t-001–t-010 |
| r-family | Para toda la familia | standard | home, movies | t-011–t-020 |
| r-drama | Dramas premiados | standard | movies | t-021–t-030 |
| r-series-comedy | Comedias y animación | standard | series | t-041–t-050 |
| r-series-thriller | Suspense y ciencia ficción | standard | series | t-051–t-060 |
| r-new | Novedades populares | standard | new | t-006–t-010, t-036–t-040, t-046–t-050 |
| r-new-series | Estrenos de series | standard | new | t-051–t-056 |

## T030 · `src/data/catalog.ts`
- **Importa** los 6 `titles-*.json`, `rows.json`, `profiles.json`, `notifications.json`.
- **Exporta**:
  ```ts
  export const titles: Title[]          // los 6 ficheros concatenados
  export const rows: Row[]
  export const profiles: Profile[]
  export const notifications: Notification[]
  export const FEATURED_ID = 't-001'
  export function getTitle(id: string): Title | undefined
  ```
- Tipa con `as Title[]` etc. al importar el JSON.

## T031 · `src/data/catalog.test.ts`
- Comprueba: 60 títulos con ids únicos; todo `titleIds` de las filas existe en el catálogo; `r-top10` tiene 10 ids y las demás filas ≥ 6; películas con `durationMinutes`; series con `seasons` no vacío; ≥ 20 títulos `TP` o `7+`; 4 perfiles y solo 1 `isKids`; 3 notificaciones.

## T032 · `scripts/generate-placeholders.mjs` [P]
- **Crea**: `scripts/generate-placeholders.mjs` (Node ESM, solo `fs` y `path`).
- **Hace**: lee `src/data/titles-*.json` y `src/data/profiles.json`; crea las carpetas si faltan y escribe:
  - `public/assets/posters/<id>.svg` (300×450) y `public/assets/banners/<id>.svg` (1600×700): degradado con color derivado de un hash del `id` y el nombre centrado;
  - `public/assets/avatars/<id>.svg` (128×128) por perfil;
  - `public/assets/placeholder.svg` (300×450, gris, texto "Sin imagen").
- **Hecho cuando**: `node scripts/generate-placeholders.mjs` termina sin error.

## T033 · Generar activos
- **Ejecuta**: `npm run assets`.
- **Hecho cuando**: `ls public/assets/posters | wc -l` da `60` y existe `public/assets/placeholder.svg`. *(Opcional, manual: sustituir SVG por arte real con el mismo nombre.)*

## T034 · GATE P03
- **Ejecuta**: `npm run typecheck && npm test && npm run build`. Commit: `feat(P03): catálogo y activos`.
