# NOTES — dudas y desviaciones

## P01
- **T001**: `npm create vite@5 .` es interactivo en un directorio no vacío; la plantilla `react-ts` se generó en una carpeta temporal y se copió a la raíz (resultado idéntico). `name` de `package.json` = `netflix-browse`.
- **T002**: `@testing-library/jest-dom` sin versión instala la 8.x, que exige `vitest >=5 <6` (conflicto con `vitest@2`). Se fija `@testing-library/jest-dom@6`. Se añade `@testing-library/dom@10`, peer obligatorio de `@testing-library/react@16`.

## P02
- **Vitest + Node 26**: Node ≥ 25 expone un `localStorage` global nativo (sin `--localstorage-file` vale `undefined`) que tapa al de jsdom, y `localStorage.clear()` en `setup.ts` rompía todas las pruebas. Se añade a `vite.config.ts` `test.poolOptions.forks.execArgv: ['--no-experimental-webstorage']`. Si se usa Node 22 LTS no hace falta, pero es inocuo.
- **T011**: la ficha dice "18 variables", pero la tabla enumera 20 (6 color + 6 espacio + 1 tipografía + 3 capas + 3 previsualización + 1 cabecera). Se crean las 20.

## P04
- **T035 / T048 — formato de `nbc:profile`**: T035 pide leer con `readJson` (JSON), pero T048 escribe el id en crudo (`localStorage.setItem('nbc:profile', 'p-1')`), que no es JSON válido. `useProfile` escribe con `writeJson` y al leer acepta ambos formatos: primero JSON y, si falla, el valor en crudo. Cubierto por la prueba "acepta el id guardado sin comillas JSON".
- **T037**: el cambio de perfil se detecta durante el render (estado `{ key, ids }`), sin `useEffect`, para no pintar un fotograma con la lista del perfil anterior.

## P06
- **T065 (MANUAL)**: pendiente. No existe `public/assets/video/sample.mp4`; sin él el `<video>` falla, se oculta por `onError` y el hero muestra el banner. Para activarlo, copiar un vídeo corto (≤ 15 s) con ese nombre.

## P08
- **T078 — foco dentro de la tarjeta**: la ficha pasa `handlers.onBlur` tal cual al `<li>`, pero `blur` burbujea: al tabular del botón de la tarjeta a `preview-play` se cerraba la previsualización y los botones eran inalcanzables con teclado. `TitleCard` envuelve `onBlur` y solo cierra si el foco sale de la tarjeta (`relatedTarget` fuera del `<li>`). `useHoverPreview` no cambia. Cubierto por una prueba extra en `TitleCard.test.tsx`.
- **T077**: "1 temporada" en singular cuando una serie tiene una sola; el catálogo actual siempre tiene 2.

## P09
- **T087**: `TitleModalHost` pasa `key={current.id}` a `TitleModal`. Así, al abrir un título similar desde el propio modal, el selector de temporada vuelve a la temporada 1 y el foco se restaura al elemento original. No altera el contrato.
- **T081**: además de lo pedido, `Shift+Tab` con el foco en el propio diálogo (que se enfoca al abrir, `tabIndex=-1`) también salta al último enfocable; sin esto el foco escapaba del modal.

## P11
- **T098 — foco al cambiar de página**: cada página pinta su propia `<Header />`, así que al escribir en `/browse` y navegar a `/search` el `SearchBox` se desmonta y se monta de nuevo, y el campo perdía el foco a mitad de escritura. Si hay `q` en la URL al montar, `SearchBox` enfoca el campo. Además, el `<input>` cerrado lleva `tabIndex={-1}` para que no reciba foco con Tab estando invisible (ancho 0).
- **T098**: no se vuelve a navegar si `debounced` ya coincide con la `q` de la URL en `/search` (evita una navegación redundante al montar).
- **T102 — pruebas con temporizadores**: `userEvent` con `vi.useFakeTimers()` se cuelga en Vitest (la espera interna de Testing Library solo detecta temporizadores falsos de Jest). `SearchBox.test.tsx` usa `fireEvent` + `act(() => vi.advanceTimersByTime(...))` en lugar de `userEvent.setup({ advanceTimers })`. Cubre los mismos casos.
- **Lint**: `npm run lint` da 0 errores y 3 avisos `react-refresh/only-export-components` (proveedor y hook en el mismo fichero, como pide P04). No bloquean.
