# Feature Specification: Netflix Browse Clone

**Feature Branch**: `001-netflix-browse`

**Created**: 2026-11-21

**Status**: Draft

**Input**: User description: "Réplica visual y funcional de la página de exploración de Netflix (/browse), tal como la ve un usuario ya logueado, para una demo local educativa. Interfaz en español de España. Un título destacado a pantalla completa y filas horizontales de títulos por categoría, con una experiencia de navegación cercana a la original."

## Clarifications

### Session 2026-11-21

- Q: ¿Qué clasificaciones de edad se consideran aptas para el perfil Infantil? → A: Solo `TP` y `7+`.
- Q: ¿Se usa el mismo vídeo de muestra en el reproductor y en el fondo del título destacado? → A: Sí, un único clip de muestra local para todo.
- Q: ¿Qué hacen los enlaces Series, Películas y Novedades populares? → A: Filtran el inicio: Series y Películas muestran las filas de ese tipo; Novedades populares muestra las filas de lo más reciente.
- Q: ¿Qué ocurre al pulsar el icono de notificaciones? → A: Se abre un panel desplegable con 3 avisos de ejemplo estáticos, cerrable con Escape.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Cabecera de navegación (Priority: P1)

Como espectador quiero una cabecera fija con logotipo, enlaces de navegación (Inicio, Series, Películas, Novedades populares, Mi lista), buscador, notificaciones y menú de perfil, para moverme por el catálogo de forma intuitiva.

**Why this priority**: es el marco de toda la experiencia; sin ella no hay forma de acceder al resto de secciones. Es la base visible de la demo.

**Independent Test**: se puede probar abriendo la página y comprobando la cabecera, el scroll y el menú de perfil, sin que existan aún el resto de secciones.

**Acceptance Scenarios**:

1. **Given** la página recién cargada en la parte superior, **When** la observo, **Then** la cabecera es transparente y muestra logotipo, enlaces, buscador, notificaciones y perfil.
2. **Given** la cabecera transparente, **When** hago scroll hacia abajo, **Then** pasa a fondo sólido y sigue fija en pantalla.
3. **Given** una pantalla estrecha (móvil), **When** veo la cabecera, **Then** los enlaces de navegación se agrupan en un menú desplegable.
4. **Given** la cabecera visible, **When** abro el menú de perfil, **Then** veo la lista de perfiles y la opción "Cerrar sesión" (simulada).
5. **Given** la página de inicio, **When** pulso "Series" o "Películas", **Then** el inicio muestra solo las filas de ese tipo; con "Novedades populares" muestra las filas de lo más reciente; con "Inicio" vuelve a mostrar todas.
6. **Given** la cabecera visible, **When** pulso el icono de notificaciones, **Then** se abre un panel con 3 avisos de ejemplo que se cierra con Escape o al pulsar fuera.

---

### User Story 2 - Título destacado (hero) (Priority: P1)

Como espectador quiero un título destacado a ancho completo, con imagen o vídeo de fondo, título o logotipo, sinopsis breve, etiqueta de edad y botones "Reproducir" y "Más información", para interactuar enseguida con contenido relevante.

**Why this priority**: es el primer impacto visual de la página y define la identidad de la réplica.

**Independent Test**: se prueba cargando la página y verificando el contenido, la legibilidad del texto y la acción de ambos botones.

**Acceptance Scenarios**:

1. **Given** la página cargada, **When** la veo, **Then** aparece un título destacado a ancho completo con sinopsis, etiqueta de edad y los botones "Reproducir" y "Más información".
2. **Given** el título destacado, **When** pulso "Más información", **Then** se abre el detalle del título (ver historia de detalle).
3. **Given** el título destacado, **When** pulso "Reproducir", **Then** se abre el reproductor simulado.
4. **Given** una imagen de fondo clara, **When** leo el texto, **Then** sigue siendo legible gracias a un degradado.
5. **Given** un usuario con la preferencia de movimiento reducido, **When** carga la página, **Then** el vídeo de fondo no se reproduce y se muestra una imagen fija.

---

### User Story 3 - Filas de títulos (carruseles) (Priority: P1)

Como espectador quiero filas por categoría ("Tendencias", "Porque has visto…", "Top 10 en España", "Series de TV", "Películas de acción") con desplazamiento horizontal paginado, para explorar contenido organizado por intereses.

**Why this priority**: es el corazón de la página de exploración; sin filas no hay descubrimiento de contenido.

**Independent Test**: se prueba navegando una fila con ratón, teclado y táctil, y comprobando extremos y número de tarjetas visibles.

**Acceptance Scenarios**:

1. **Given** una fila de títulos, **When** paso el ratón por encima, **Then** aparecen las flechas anterior y siguiente.
2. **Given** una fila, **When** pulso la flecha siguiente o uso el teclado o deslizo con el dedo, **Then** la fila avanza una página.
3. **Given** el inicio o el final de la fila, **When** llego a un extremo, **Then** la flecha correspondiente se oculta o se deshabilita.
4. **Given** distintos anchos de pantalla, **When** cambio el tamaño de la ventana, **Then** el número de tarjetas visibles se adapta (6, 5, 4, 3 o 2).
5. **Given** la fila "Top 10 en España", **When** la veo, **Then** cada póster muestra un número grande junto a él.

---

### User Story 4 - Tarjeta con previsualización (Priority: P1)

Como espectador quiero que al pasar el ratón (o enfocar con teclado) sobre una tarjeta esta se amplíe y muestre acciones (reproducir, añadir a mi lista, me gusta, más información), duración o temporadas, edad y géneros, para decidir sin abrir el detalle.

**Why this priority**: aporta la sensación de producto real y conecta las filas con las acciones principales.

**Independent Test**: se prueba pasando el ratón y navegando con teclado sobre una tarjeta y comprobando que la fila no se desplaza.

**Acceptance Scenarios**:

1. **Given** una fila, **When** paso el ratón sobre una tarjeta y espero un instante, **Then** la tarjeta se amplía mostrando acciones, duración o temporadas, edad y géneros.
2. **Given** la tarjeta ampliada, **When** se amplía, **Then** el resto de tarjetas de la fila no cambian de posición.
3. **Given** la tarjeta ampliada, **When** pulso Escape o saco el ratón o el foco, **Then** se cierra la previsualización.
4. **Given** un dispositivo táctil, **When** toco una tarjeta, **Then** se abre directamente el detalle del título.

---

### User Story 5 - Detalle de título (Priority: P2)

Como espectador quiero ver sinopsis completa, reparto, géneros, año y duración y, en series, un selector de temporada con lista de episodios, para conocer un título a fondo.

**Why this priority**: completa el flujo de descubrimiento, pero la página es útil sin él.

**Independent Test**: se prueba abriendo el detalle de una película y de una serie desde cualquier punto de entrada.

**Acceptance Scenarios**:

1. **Given** un título, **When** abro su detalle, **Then** veo sinopsis, reparto, géneros, año y duración, además de una sección de títulos similares.
2. **Given** el detalle de una serie, **When** elijo una temporada, **Then** se listan sus episodios.
3. **Given** el detalle abierto, **When** pulso Escape, el botón de cierre o fuera del panel, **Then** se cierra y el foco vuelve al elemento que lo abrió.
4. **Given** el detalle abierto, **When** navego con Tab, **Then** el foco permanece dentro del detalle.

---

### User Story 6 - Mi lista (Priority: P2)

Como espectador quiero añadir y quitar títulos de "Mi lista" y verlos juntos, para guardar lo que quiero ver más tarde.

**Why this priority**: añade personalización con poco coste, pero no es imprescindible para explorar.

**Independent Test**: se prueba añadiendo y quitando un título, recargando y abriendo "Mi lista".

**Acceptance Scenarios**:

1. **Given** un título, **When** pulso el botón de añadir, **Then** el título se guarda y el botón pasa de "+" a "✓".
2. **Given** un título ya guardado, **When** pulso el botón, **Then** se quita de la lista y el botón vuelve a "+".
3. **Given** títulos guardados, **When** recargo la página, **Then** siguen en "Mi lista".
4. **Given** el botón de añadir o quitar, **When** un lector de pantalla lo anuncia, **Then** su nombre refleja la acción disponible.

---

### User Story 7 - Búsqueda (Priority: P2)

Como espectador quiero buscar por título, género o actor y ver los resultados en una cuadrícula, para llegar rápido a lo que busco.

**Why this priority**: es una vía de acceso alternativa a las filas, útil pero secundaria.

**Independent Test**: se prueba escribiendo en el buscador con y sin resultados y vaciándolo.

**Acceptance Scenarios**:

1. **Given** la cabecera, **When** pulso la lupa, **Then** el campo de búsqueda se expande.
2. **Given** el campo abierto, **When** escribo, **Then** los resultados se actualizan en una cuadrícula tras una breve pausa.
3. **Given** una búsqueda sin coincidencias, **When** termina de actualizarse, **Then** veo un mensaje de que no hay resultados.
4. **Given** resultados mostrados, **When** vacío el campo, **Then** vuelvo a la página de inicio.

---

### User Story 8 - Selección de perfil (Priority: P3)

Como espectador quiero una pantalla inicial "¿Quién está viendo ahora?" con 4 perfiles, incluido un perfil Infantil, para entrar con el perfil que corresponda.

**Why this priority**: refuerza el realismo de la demo, pero no afecta a la exploración.

**Independent Test**: se prueba eligiendo cada perfil y comprobando el catálogo mostrado y que se recuerda la elección.

**Acceptance Scenarios**:

1. **Given** la pantalla inicial, **When** la veo, **Then** aparecen 4 perfiles, uno de ellos Infantil.
2. **Given** la pantalla de perfiles, **When** elijo uno, **Then** accedo a la página de exploración.
3. **Given** el perfil Infantil, **When** exploro el catálogo, **Then** solo veo títulos con clasificación `TP` o `7+`.
4. **Given** que ya elegí un perfil, **When** vuelvo a abrir la página, **Then** se recuerda mi elección.

---

### User Story 9 - Reproductor simulado (Priority: P3)

Como espectador quiero una vista de reproducción con vídeo de muestra, controles básicos (reproducir/pausar, volumen, pantalla completa, barra de progreso) y un botón para volver, para completar el flujo de "Reproducir".

**Why this priority**: cierra el recorrido del botón "Reproducir", pero no es esencial para la exploración.

**Independent Test**: se prueba pulsando "Reproducir" desde cualquier título y usando cada control con ratón y teclado.

**Acceptance Scenarios**:

1. **Given** un título, **When** pulso "Reproducir", **Then** se abre la vista de reproducción con el vídeo de muestra, el mismo para todos los títulos.
2. **Given** la reproducción, **When** uso los controles, **Then** puedo pausar, cambiar el volumen, pasar a pantalla completa y moverme por la barra de progreso.
3. **Given** la reproducción, **When** uso teclado (espacio, flechas, F, M, Escape), **Then** cada tecla ejecuta su acción asociada.
4. **Given** la reproducción, **When** pulso el botón de volver, **Then** regreso a la página de exploración.

---

### Edge Cases

- Una fila con menos títulos que tarjetas visibles: no muestra flechas ni deja huecos.
- Una búsqueda con texto muy largo, solo espacios o caracteres especiales: no falla y se trata como sin resultados o como vacía.
- Un título sin imagen de carátula o de banner: se muestra una imagen sustituta sin romper el diseño.
- "Mi lista" vacía: se muestra un mensaje que explica cómo añadir títulos.
- Cambio de tamaño de ventana mientras hay una previsualización o una fila desplazada: el estado se mantiene coherente.
- Datos guardados corruptos o ausentes (perfil, Mi lista): la aplicación arranca con valores por defecto.
- Usuario con movimiento reducido: ninguna animación esencial impide usar la página.
- Un episodio o una temporada sin contenido: se indica sin errores.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: La página MUST mostrar una cabecera fija con logotipo, enlaces de navegación, buscador, notificaciones y menú de perfil.
- **FR-002**: La cabecera MUST ser transparente en la parte superior y pasar a fondo sólido al desplazarse.
- **FR-003**: En pantallas estrechas, los enlaces de navegación MUST agruparse en un menú desplegable.
- **FR-004**: El menú de perfil MUST listar los perfiles y ofrecer "Cerrar sesión" simulado.
- **FR-005**: La página MUST mostrar un título destacado a ancho completo con sinopsis, etiqueta de edad y botones "Reproducir" y "Más información".
- **FR-006**: El texto del título destacado MUST ser legible sobre la imagen de fondo.
- **FR-007**: El vídeo de fondo del título destacado MUST detenerse con la preferencia de movimiento reducido.
- **FR-008**: La página MUST mostrar filas horizontales por categoría, incluida una fila "Top 10 en España" con números grandes.
- **FR-009**: Cada fila MUST ofrecer navegación anterior y siguiente por ratón, teclado y táctil, ocultando o deshabilitando las flechas en los extremos.
- **FR-010**: El número de tarjetas visibles por fila MUST adaptarse al ancho de pantalla (6, 5, 4, 3 o 2).
- **FR-011**: Al pasar el ratón o enfocar una tarjeta, esta MUST ampliarse mostrando acciones, duración o temporadas, edad y géneros, sin desplazar al resto de la fila.
- **FR-012**: La previsualización MUST cerrarse con Escape o al perder ratón o foco; en dispositivos táctiles un toque MUST abrir el detalle.
- **FR-013**: El detalle de un título MUST mostrar sinopsis, reparto, géneros, año, duración y títulos similares.
- **FR-014**: El detalle de una serie MUST permitir elegir temporada y listar sus episodios.
- **FR-015**: El detalle MUST cerrarse con Escape, botón de cierre o clic fuera, mantener el foco dentro mientras está abierto y devolverlo al elemento de origen.
- **FR-016**: El usuario MUST poder añadir y quitar títulos de "Mi lista", con indicador visible y nombre accesible acordes al estado.
- **FR-017**: "Mi lista" MUST conservarse entre recargas y mostrar un mensaje cuando esté vacía.
- **FR-018**: El usuario MUST poder buscar por título, género o actor y ver los resultados en una cuadrícula que se actualiza al escribir.
- **FR-019**: La búsqueda sin coincidencias MUST mostrar un mensaje; vaciar el campo MUST volver al inicio.
- **FR-020**: La aplicación MUST ofrecer una pantalla de selección con 4 perfiles, uno Infantil, y recordar el perfil elegido.
- **FR-021**: El perfil Infantil MUST mostrar solo títulos con clasificación `TP` o `7+`.
- **FR-022**: El reproductor simulado MUST ofrecer reproducir/pausar, volumen, pantalla completa, barra de progreso y botón de volver, y MUST usar un único vídeo de muestra para todos los títulos, también como fondo del título destacado.
- **FR-023**: El reproductor MUST poder controlarse con teclado (espacio, flechas, F, M, Escape).
- **FR-024**: Todo el contenido MUST proceder de un catálogo local, sin depender de servicios externos al ejecutarse.
- **FR-025**: La interfaz MUST estar en español de España, ser oscura y funcionar sin ratón.
- **FR-026**: Los enlaces "Series" y "Películas" MUST filtrar el inicio para mostrar solo las filas de ese tipo; "Novedades populares" MUST mostrar las filas de lo más reciente; "Inicio" MUST restaurar todas las filas.
- **FR-027**: El icono de notificaciones MUST abrir un panel con 3 avisos de ejemplo estáticos, cerrable con Escape o al pulsar fuera.

### Key Entities *(include if feature involves data)*

- **Título**: película o serie con carátula, banner, sinopsis, géneros, año, clasificación de edad, duración y reparto; las series incluyen temporadas.
- **Temporada / Episodio**: una temporada agrupa episodios; cada episodio tiene número, nombre, sinopsis y duración.
- **Fila (categoría)**: conjunto ordenado de títulos con un nombre; puede ser de tipo Top 10.
- **Perfil**: usuario simulado con nombre, avatar y marca de si es Infantil.
- **Mi lista**: conjunto de títulos que el usuario ha guardado, asociado a su perfil.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un espectador llega al detalle de cualquier título del inicio en un máximo de 3 acciones.
- **SC-002**: El 100 % de las funciones principales (navegar filas, abrir detalle, añadir a Mi lista, buscar) se puede completar solo con teclado.
- **SC-003**: La página es utilizable sin desplazamiento horizontal de la página en anchos de 360, 768, 1280 y 1920 px.
- **SC-004**: El texto y los controles cumplen un contraste mínimo de 4,5:1.
- **SC-005**: El contenido principal de la página de inicio es visible y usable en menos de 3 segundos en un equipo de escritorio estándar.
- **SC-006**: Un título añadido a "Mi lista" sigue presente tras recargar la página en el 100 % de los casos.
- **SC-007**: Las búsquedas muestran resultados o el mensaje de "sin resultados" en menos de 1 segundo desde que se deja de escribir.
- **SC-008**: Con la preferencia de movimiento reducido activada, ninguna animación o vídeo se reproduce automáticamente.

## Assumptions

- Es una demo educativa local; no se publica ni requiere cuentas reales.
- El usuario ya está "logueado": no hay registro ni inicio de sesión real.
- El catálogo es de unos 60 títulos (ficticios o reales) con carátula, banner, sinopsis, géneros, año, edad, duración y reparto; las series tienen temporadas y episodios.
- El autor dispone de permiso y derechos para usar marca y activos con copyright en local.
- Los perfiles, la lista y la elección de perfil se conservan en el propio dispositivo, sin servidor.
- Fuera de alcance: pagos, registro real, catálogo remoto, recomendaciones personalizadas reales, descargas, subtítulos y audio múltiple, DRM.
- La interfaz es solo en español de España.
- Los avisos de notificaciones y el vídeo de muestra son contenido estático local; "Cerrar sesión" devuelve a la pantalla de selección de perfil.
