# Feature Specification: Netflix Browse Clone

| Campo | Valor |
|---|---|
| **Feature Branch** | `001-netflix-browse` |
| **Created** | 2026-11-21 |
| **Status** | Draft |
| **Idioma de la interfaz** | Español de España |
| **Alcance** | Réplica visual y funcional de `/browse` (usuario ya logueado) para una demo local educativa |

**Input**: título destacado a pantalla completa y filas horizontales de títulos por categoría, con una experiencia cercana a la original.

## Clarifications

### Session 2026-11-21

| # | Pregunta | Respuesta |
|---|---|---|
| Q1 | ¿Qué clasificaciones aptas para el perfil Infantil? | Solo `TP` y `7+`. |
| Q2 | ¿Mismo vídeo en reproductor y hero? | Sí, un único clip local para todo. |
| Q3 | ¿Qué hacen Series, Películas y Novedades populares? | Filtran el inicio: Series y Películas muestran las filas de ese tipo; Novedades populares, las de lo más reciente. |
| Q4 | ¿Qué hace el icono de notificaciones? | Panel desplegable con 3 avisos estáticos, cerrable con Escape. |

## User Scenarios & Testing *(mandatory)*

Cada historia es independiente, probable por separado y tiene prioridad. Un escenario = `US#-A#`.

### US1 · Cabecera de navegación — P1

**Como** espectador **quiero** una cabecera fija con logotipo, enlaces (Inicio, Series, Películas, Novedades populares, Mi lista), buscador, notificaciones y menú de perfil **para** moverme por el catálogo.
**Por qué P1**: es el marco de toda la experiencia.
**Prueba independiente**: abrir la página y comprobar cabecera, scroll y menú de perfil.

| ID | Dado | Cuando | Entonces |
|---|---|---|---|
| US1-A1 | la página recién cargada arriba | la observo | la cabecera es transparente con logotipo, enlaces, buscador, notificaciones y perfil |
| US1-A2 | la cabecera transparente | hago scroll abajo | pasa a fondo sólido y sigue fija |
| US1-A3 | una pantalla estrecha | veo la cabecera | los enlaces se agrupan en un menú desplegable |
| US1-A4 | la cabecera visible | abro el menú de perfil | veo los perfiles y "Cerrar sesión" (simulada) |
| US1-A5 | la página de inicio | pulso Series, Películas o Novedades populares | solo se muestran las filas de esa vista; "Inicio" las muestra todas |
| US1-A6 | la cabecera visible | pulso notificaciones | se abre un panel con 3 avisos que se cierra con Escape o al pulsar fuera |

### US2 · Título destacado (hero) — P1

**Como** espectador **quiero** un título destacado a ancho completo con imagen o vídeo, título, sinopsis, etiqueta de edad y botones "Reproducir" y "Más información".
**Por qué P1**: primer impacto visual.
**Prueba independiente**: cargar la página y verificar contenido, legibilidad y ambos botones.

| ID | Dado | Cuando | Entonces |
|---|---|---|---|
| US2-A1 | la página cargada | la veo | hay un título destacado a ancho completo con sinopsis, edad y ambos botones |
| US2-A2 | el título destacado | pulso "Más información" | se abre el detalle |
| US2-A3 | el título destacado | pulso "Reproducir" | se abre el reproductor simulado |
| US2-A4 | una imagen de fondo clara | leo el texto | sigue legible gracias a un degradado |
| US2-A5 | movimiento reducido activado | carga la página | el vídeo no se reproduce y se muestra una imagen fija |

### US3 · Filas de títulos (carruseles) — P1

**Como** espectador **quiero** filas por categoría ("Tendencias", "Porque has visto…", "Top 10 en España", "Series de TV", "Películas de acción") con desplazamiento horizontal paginado.
**Por qué P1**: es el corazón de la exploración.
**Prueba independiente**: navegar una fila con ratón, teclado y táctil y comprobar extremos y tarjetas visibles.

| ID | Dado | Cuando | Entonces |
|---|---|---|---|
| US3-A1 | una fila | paso el ratón por encima | aparecen las flechas anterior y siguiente |
| US3-A2 | una fila | pulso siguiente, uso teclado o deslizo | avanza una página |
| US3-A3 | el inicio o el final | llego a un extremo | la flecha correspondiente se oculta o deshabilita |
| US3-A4 | distintos anchos | cambio el tamaño de ventana | se ven 6, 5, 4, 3 o 2 tarjetas |
| US3-A5 | la fila "Top 10 en España" | la veo | cada póster muestra un número grande |

### US4 · Tarjeta con previsualización — P1

**Como** espectador **quiero** que al pasar el ratón o enfocar una tarjeta esta se amplíe con acciones (reproducir, añadir a mi lista, me gusta, más información), duración o temporadas, edad y géneros.
**Por qué P1**: conecta las filas con las acciones principales.
**Prueba independiente**: ratón y teclado sobre una tarjeta; la fila no se desplaza.

| ID | Dado | Cuando | Entonces |
|---|---|---|---|
| US4-A1 | una fila | paso el ratón sobre una tarjeta y espero | se amplía con acciones, duración o temporadas, edad y géneros |
| US4-A2 | la tarjeta ampliada | se amplía | el resto de tarjetas no cambian de posición |
| US4-A3 | la tarjeta ampliada | pulso Escape o saco ratón o foco | se cierra |
| US4-A4 | un dispositivo táctil | toco una tarjeta | se abre directamente el detalle |

### US5 · Detalle de título — P2

**Como** espectador **quiero** ver sinopsis, reparto, géneros, año y duración y, en series, selector de temporada con episodios.
**Por qué P2**: completa el descubrimiento, pero la página es útil sin él.
**Prueba independiente**: abrir el detalle de una película y de una serie desde cualquier entrada.

| ID | Dado | Cuando | Entonces |
|---|---|---|---|
| US5-A1 | un título | abro su detalle | veo sinopsis, reparto, géneros, año, duración y títulos similares |
| US5-A2 | el detalle de una serie | elijo una temporada | se listan sus episodios |
| US5-A3 | el detalle abierto | pulso Escape, cierre o fuera del panel | se cierra y el foco vuelve al origen |
| US5-A4 | el detalle abierto | navego con Tab | el foco permanece dentro |

### US6 · Mi lista — P2

**Como** espectador **quiero** añadir y quitar títulos de "Mi lista" y verlos juntos.
**Por qué P2**: personalización barata, no imprescindible.
**Prueba independiente**: añadir, quitar, recargar y abrir "Mi lista".

| ID | Dado | Cuando | Entonces |
|---|---|---|---|
| US6-A1 | un título | pulso añadir | se guarda y el botón pasa de "+" a "✓" |
| US6-A2 | un título guardado | pulso el botón | se quita y vuelve a "+" |
| US6-A3 | títulos guardados | recargo | siguen en "Mi lista" |
| US6-A4 | el botón | un lector de pantalla lo anuncia | su nombre refleja la acción disponible |

### US7 · Búsqueda — P2

**Como** espectador **quiero** buscar por título, género o actor y ver resultados en cuadrícula.
**Por qué P2**: vía alternativa a las filas.
**Prueba independiente**: escribir con y sin resultados y vaciar el campo.

| ID | Dado | Cuando | Entonces |
|---|---|---|---|
| US7-A1 | la cabecera | pulso la lupa | el campo se expande |
| US7-A2 | el campo abierto | escribo | los resultados se actualizan en cuadrícula tras una breve pausa |
| US7-A3 | una búsqueda sin coincidencias | termina de actualizarse | veo un mensaje de que no hay resultados |
| US7-A4 | resultados mostrados | vacío el campo | vuelvo al inicio |

### US8 · Selección de perfil — P3

**Como** espectador **quiero** una pantalla "¿Quién está viendo ahora?" con 4 perfiles, uno Infantil.
**Por qué P3**: realismo, no afecta a la exploración.
**Prueba independiente**: elegir cada perfil y comprobar catálogo y recuerdo de la elección.

| ID | Dado | Cuando | Entonces |
|---|---|---|---|
| US8-A1 | la pantalla inicial | la veo | aparecen 4 perfiles, uno Infantil |
| US8-A2 | la pantalla de perfiles | elijo uno | accedo a la exploración |
| US8-A3 | el perfil Infantil | exploro | solo veo `TP` o `7+` |
| US8-A4 | un perfil ya elegido | vuelvo a abrir la página | se recuerda la elección |

### US9 · Reproductor simulado — P3

**Como** espectador **quiero** una vista de reproducción con vídeo de muestra, controles básicos y botón de volver.
**Por qué P3**: cierra el recorrido de "Reproducir".
**Prueba independiente**: pulsar "Reproducir" y usar cada control con ratón y teclado.

| ID | Dado | Cuando | Entonces |
|---|---|---|---|
| US9-A1 | un título | pulso "Reproducir" | se abre la vista con el vídeo de muestra, el mismo para todos |
| US9-A2 | la reproducción | uso los controles | puedo pausar, cambiar volumen, pantalla completa y mover la barra de progreso |
| US9-A3 | la reproducción | uso espacio, flechas, F, M, Escape | cada tecla ejecuta su acción |
| US9-A4 | la reproducción | pulso volver | regreso a la exploración |

### Edge Cases

| ID | Caso | Comportamiento esperado |
|---|---|---|
| EC-1 | Fila con menos títulos que tarjetas visibles | sin flechas ni huecos |
| EC-2 | Búsqueda muy larga, solo espacios o caracteres especiales | no falla; sin resultados o como vacía |
| EC-3 | Título sin carátula o banner | imagen sustituta, diseño intacto |
| EC-4 | "Mi lista" vacía | mensaje que explica cómo añadir |
| EC-5 | Redimensionar con previsualización o fila desplazada | estado coherente |
| EC-6 | Datos guardados corruptos o ausentes | arranca con valores por defecto |
| EC-7 | Movimiento reducido | ninguna animación esencial bloquea el uso |
| EC-8 | Temporada o episodio sin contenido | se indica sin errores |

## Requirements *(mandatory)*

### Functional Requirements

| ID | Historia | Requisito (MUST) |
|---|---|---|
| FR-001 | US1 | Cabecera fija con logotipo, enlaces, buscador, notificaciones y menú de perfil. |
| FR-002 | US1 | Cabecera transparente arriba y sólida al desplazarse. |
| FR-003 | US1 | En pantallas estrechas, los enlaces se agrupan en un menú desplegable. |
| FR-004 | US1 | El menú de perfil lista los perfiles y ofrece "Cerrar sesión" simulado. |
| FR-005 | US2 | Título destacado a ancho completo con sinopsis, edad y botones "Reproducir" y "Más información". |
| FR-006 | US2 | Texto del destacado legible sobre la imagen de fondo. |
| FR-007 | US2 | El vídeo de fondo se detiene con movimiento reducido. |
| FR-008 | US3 | Filas horizontales por categoría, incluida "Top 10 en España" con números grandes. |
| FR-009 | US3 | Navegación anterior/siguiente por ratón, teclado y táctil; flechas ocultas o deshabilitadas en extremos. |
| FR-010 | US3 | Tarjetas visibles por fila adaptadas al ancho (6, 5, 4, 3 o 2). |
| FR-011 | US4 | Al pasar el ratón o enfocar, la tarjeta se amplía con acciones, duración o temporadas, edad y géneros, sin desplazar la fila. |
| FR-012 | US4 | La previsualización se cierra con Escape o al perder ratón o foco; en táctil un toque abre el detalle. |
| FR-013 | US5 | El detalle muestra sinopsis, reparto, géneros, año, duración y títulos similares. |
| FR-014 | US5 | El detalle de una serie permite elegir temporada y lista sus episodios. |
| FR-015 | US5 | El detalle se cierra con Escape, botón o clic fuera, mantiene el foco dentro y lo devuelve al origen. |
| FR-016 | US6 | Añadir y quitar títulos de "Mi lista", con indicador visible y nombre accesible acordes al estado. |
| FR-017 | US6 | "Mi lista" se conserva entre recargas y muestra un mensaje cuando está vacía. |
| FR-018 | US7 | Buscar por título, género o actor con resultados en cuadrícula que se actualiza al escribir. |
| FR-019 | US7 | Sin coincidencias → mensaje; vaciar el campo → vuelta al inicio. |
| FR-020 | US8 | Pantalla de selección con 4 perfiles (uno Infantil) y recuerdo del elegido. |
| FR-021 | US8 | El perfil Infantil solo muestra títulos `TP` o `7+`. |
| FR-022 | US9 | Reproductor con reproducir/pausar, volumen, pantalla completa, progreso y volver; un único vídeo de muestra para todos los títulos y para el hero. |
| FR-023 | US9 | El reproductor se controla con teclado (espacio, flechas, F, M, Escape). |
| FR-024 | todas | Todo el contenido procede de un catálogo local, sin servicios externos en ejecución. |
| FR-025 | todas | Interfaz en español de España, oscura y utilizable sin ratón. |
| FR-026 | US1 | "Series" y "Películas" filtran el inicio; "Novedades populares" muestra lo más reciente; "Inicio" restaura todo. |
| FR-027 | US1 | El icono de notificaciones abre un panel con 3 avisos estáticos, cerrable con Escape o al pulsar fuera. |

### Key Entities

| Entidad | Descripción |
|---|---|
| Título | Película o serie: carátula, banner, sinopsis, géneros, año, edad, duración y reparto; las series incluyen temporadas. |
| Temporada / Episodio | Una temporada agrupa episodios (número, nombre, sinopsis, duración). |
| Fila | Conjunto ordenado de títulos con nombre; puede ser Top 10. |
| Perfil | Usuario simulado: nombre, avatar y marca Infantil. |
| Mi lista | Títulos guardados, asociados a un perfil. |

## Success Criteria *(mandatory)*

| ID | Criterio medible |
|---|---|
| SC-001 | Llegar al detalle de cualquier título del inicio en ≤ 3 acciones. |
| SC-002 | El 100 % de las funciones principales (filas, detalle, Mi lista, búsqueda) se completa solo con teclado. |
| SC-003 | Sin scroll horizontal de página a 360, 768, 1280 y 1920 px. |
| SC-004 | Contraste mínimo de 4,5:1 en texto y controles. |
| SC-005 | Contenido principal del inicio usable en < 3 s en un equipo de escritorio estándar. |
| SC-006 | Un título añadido a "Mi lista" sigue presente tras recargar en el 100 % de los casos. |
| SC-007 | Resultados o mensaje de "sin resultados" en < 1 s desde que se deja de escribir. |
| SC-008 | Con movimiento reducido, ninguna animación o vídeo se reproduce automáticamente. |

## Assumptions

- Demo educativa local; sin cuentas reales ni publicación. El usuario ya está "logueado".
- Catálogo de unos 60 títulos ficticios con carátula, banner, sinopsis, géneros, año, edad, duración y reparto; series con temporadas y episodios.
- El autor dispone de permiso y derechos para usar marca y activos con copyright en local.
- Perfiles, lista y elección de perfil se conservan en el dispositivo, sin servidor.
- **Fuera de alcance**: pagos, registro real, catálogo remoto, recomendaciones reales, descargas, subtítulos, audio múltiple, DRM.
- Avisos y vídeo de muestra son estáticos y locales; "Cerrar sesión" vuelve a la selección de perfil.
