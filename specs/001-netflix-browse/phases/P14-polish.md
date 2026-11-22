# P14 · Pulido y comprobaciones finales (T120–T129)

**Objetivo**: cumplir la constitución y los criterios de éxito. Las tareas `[MANUAL]` las hace una persona.
**Requisito previo**: P13 en verde.

## T120 · README [P]
- **Reescribe**: `README.md` con: descripción de la demo, requisitos (Node ≥ 20), tabla de scripts (`dev`, `build`, `preview`, `test`, `typecheck`, `lint`, `assets`), estructura de carpetas y nota de que `public/assets` puede sustituirse por arte real.

## T121 · Lint
- **Ejecuta**: `npm run lint`.
- **Hecho cuando**: sin errores. Corrige solo lo señalado, sin cambiar el comportamiento.

## T122 · Imágenes solo con `SafeImage` [P]
- **Ejecuta**: `grep -rn "<img" src --include=*.tsx | grep -v SafeImage.tsx | grep -v test`.
- **Hecho cuando**: no devuelve nada (si devuelve algo, cámbialo a `SafeImage` con `width` y `height`).

## T123 · Sin `any` [P]
- **Ejecuta**: `grep -rnE "\bany\b" src --include=*.ts --include=*.tsx`.
- **Hecho cuando**: cada coincidencia se elimina o lleva un comentario que la justifica.

## T124 · [MANUAL] Contraste
- Comprobar contraste ≥ 4,5:1 de texto y controles sobre los tokens (herramienta de contraste del navegador). Criterio SC-004.

## T125 · [MANUAL] Teclado
- Recorrer toda la app solo con Tab, Shift+Tab, Enter, Espacio, flechas y Escape; foco siempre visible y nunca atrapado fuera de un modal. Criterio SC-002.

## T126 · [MANUAL] Responsive
- Sin scroll horizontal de página a 360, 768, 1280 y 1920 px. Criterio SC-003.

## T127 · [MANUAL] Movimiento reducido
- Activar "Reducir movimiento" en el sistema: el hero no reproduce vídeo y no hay animaciones esenciales. Criterio SC-008.

## T128 · [MANUAL] Recorrido por historias
- Recorrer la tabla "Comprobación manual por historia" de `quickstart.md` marcando US1…US9.

## T129 · GATE FINAL
- **Ejecuta**: `npm run lint && npm run typecheck && npm test && npm run build`.
- **Hecho cuando**: todo en verde. Commit: `feat(P14): pulido`.
