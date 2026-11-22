# NOTES — dudas y desviaciones

## P01
- **T001**: `npm create vite@5 .` es interactivo en un directorio no vacío; la plantilla `react-ts` se generó en una carpeta temporal y se copió a la raíz (resultado idéntico). `name` de `package.json` = `netflix-browse`.
- **T002**: `@testing-library/jest-dom` sin versión instala la 8.x, que exige `vitest >=5 <6` (conflicto con `vitest@2`). Se fija `@testing-library/jest-dom@6`. Se añade `@testing-library/dom@10`, peer obligatorio de `@testing-library/react@16`.
