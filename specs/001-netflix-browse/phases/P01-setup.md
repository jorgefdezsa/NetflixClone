# P01 · Setup (T001–T010)

**Objetivo**: proyecto Vite + React 18 + TypeScript compilando en la raíz, con Vitest listo.
**Salida**: `npm run build` y `npm test` sin errores.
**Antes de empezar**: lee `IMPLEMENT.md`. Estas tareas son sobre todo comandos: **no inventes versiones** y no uses `@latest`.

## T001 · Crear el proyecto Vite en la raíz
- **Hace**: ejecutar en `/Users/jorgefdezsa/Sources/Netflix`:
  `npm create vite@5 . -- --template react-ts` (elegir "Ignore files and continue"), después `npm install`.
- **Atención**: el proyecto debe quedar en la **raíz** (`package.json` junto a `.specify/`), no en una subcarpeta. Si existe `netflix-browse/`, ignórala.
- **Hecho cuando**: `npm ls react vite` muestra React 18.x y Vite 5.x.

## T002 · Instalar dependencias
- **Hace**:
  1. `npm install react-router-dom@6`
  2. `npm install -D vitest@2 jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom`
- **Hecho cuando**: `npm ls react-router-dom vitest` muestra 6.x y 2.x.

## T003 · Scripts de `package.json`
- **Edita**: `package.json`, solo `scripts`.
- **Resultado**:
  ```json
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "test": "vitest run --passWithNoTests",
    "typecheck": "tsc -b",
    "assets": "node scripts/generate-placeholders.mjs"
  }
  ```
- **Hecho cuando**: `npm run typecheck` se ejecuta (puede no tener ficheros aún).

## T004 · Configurar Vitest en `vite.config.ts`
- **Edita**: `vite.config.ts`.
- **Contrato**:
  ```ts
  import { defineConfig } from 'vitest/config';
  import react from '@vitejs/plugin-react';
  export default defineConfig({
    plugins: [react()],
    test: { environment: 'jsdom', globals: true, setupFiles: './src/test/setup.ts' },
  });
  ```
- **Hecho cuando**: el fichero compila (`npx tsc -b` sin errores de este fichero).

## T005 · `src/test/setup.ts`
- **Crea**: `src/test/setup.ts`.
- **Contenido**:
  - `import '@testing-library/jest-dom/vitest'`
  - `window.matchMedia` simulado: devuelve `{ matches: false, media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, dispatchEvent: () => false, onchange: null }`.
  - `Element.prototype.scrollBy = () => {}`.
  - `HTMLMediaElement.prototype.play = () => Promise.resolve()`, `.pause = () => {}`, `.load = () => {}`.
  - `afterEach(() => localStorage.clear())`.
- **Hecho cuando**: el fichero existe y `npm run typecheck` pasa.

## T006 · `tsconfig.app.json`
- **Edita**: `tsconfig.app.json`.
- **Resultado**: en `compilerOptions` hay `"strict": true`, `"resolveJsonModule": true` y `"types": ["vite/client", "vitest/globals"]`. Respeta el resto del fichero.
- **Hecho cuando**: `npm run typecheck` pasa.

## T007 · Tipos del dominio [P]
- **Crea**: `src/types/index.ts`.
- **Hace**: copia **literal** el contenido de `specs/001-netflix-browse/contracts/types.ts`.
- **Hecho cuando**: `diff src/types/index.ts specs/001-netflix-browse/contracts/types.ts` no muestra diferencias.

## T008 · Limpiar la plantilla [P]
- **Borra**: `src/App.tsx`, `src/App.css`, `src/index.css`, `src/assets/react.svg`, `public/vite.svg`.
- **Reescribe** `src/main.tsx`: `createRoot(document.getElementById('root')!).render(<div>Netflix Browse Clone</div>)`; sin imports de CSS.
- **Hecho cuando**: `grep -r "App" src` no devuelve resultados.

## T009 · `index.html` [P]
- **Edita**: `index.html`: `<html lang="es">`, `<title>Netflix Browse Clone</title>` y quita el `<link>` a `vite.svg`.
- **Hecho cuando**: `grep -c vite.svg index.html` devuelve `0`.

## T010 · GATE Setup
- **Ejecuta**: `npm run typecheck && npm test && npm run build` y `npm ls react vite vitest`.
- **Hecho cuando**: todo en verde; React 18.x, Vite 5.x, Vitest 2.x. Commit: `feat(P01): setup`.
