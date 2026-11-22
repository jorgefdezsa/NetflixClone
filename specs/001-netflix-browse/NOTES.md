# NOTES — dudas y desviaciones

## P01
- **T001**: `npm create vite@5 .` es interactivo en un directorio no vacío; la plantilla `react-ts` se generó en una carpeta temporal y se copió a la raíz (resultado idéntico). `name` de `package.json` = `netflix-browse`.
- **T002**: `@testing-library/jest-dom` sin versión instala la 8.x, que exige `vitest >=5 <6` (conflicto con `vitest@2`). Se fija `@testing-library/jest-dom@6`. Se añade `@testing-library/dom@10`, peer obligatorio de `@testing-library/react@16`.

## P02
- **Vitest + Node 26**: Node ≥ 25 expone un `localStorage` global nativo (sin `--localstorage-file` vale `undefined`) que tapa al de jsdom, y `localStorage.clear()` en `setup.ts` rompía todas las pruebas. Se añade a `vite.config.ts` `test.poolOptions.forks.execArgv: ['--no-experimental-webstorage']`. Si se usa Node 22 LTS no hace falta, pero es inocuo.
- **T011**: la ficha dice "18 variables", pero la tabla enumera 20 (6 color + 6 espacio + 1 tipografía + 3 capas + 3 previsualización + 1 cabecera). Se crean las 20.
