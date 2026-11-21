# Data Model: Netflix Browse Clone

**Feature**: `001-netflix-browse` | **Fecha**: 2026-11-21

Los tipos TypeScript normativos están en `contracts/types.ts`. Aquí se describen las entidades, sus reglas y sus transiciones.

## Entidades

### Title (Título)
| Campo | Tipo | Reglas |
|---|---|---|
| `id` | `string` | Único, formato `t-001`… Clave estable. |
| `type` | `'movie' \| 'series'` | Obligatorio. |
| `name` | `string` | No vacío. |
| `synopsis` | `string` | No vacío. |
| `year` | `number` | Entre 1900 y 2100. |
| `rating` | `'TP' \| '7+' \| '12+' \| '16+' \| '18+'` | Obligatorio; el perfil Infantil solo admite `TP` y `7+`. |
| `durationMinutes` | `number?` | Obligatorio si `type === 'movie'`. |
| `seasons` | `Season[]?` | Obligatorio y no vacío si `type === 'series'`. |
| `genres` | `string[]` | Al menos 1. |
| `cast` | `string[]` | Puede estar vacío. |
| `poster` | `string` | Ruta bajo `/assets/posters/`. |
| `banner` | `string` | Ruta bajo `/assets/banners/`. |
| `logo` | `string?` | Ruta bajo `/assets/logos/`; si falta se muestra `name`. |
| `addedAt` | `string` | Fecha ISO `YYYY-MM-DD`; sirve para ordenar lo más reciente. |

### Season / Episode
- **Season**: `number` (≥ 1) y `episodes: Episode[]`.
- **Episode**: `number` (≥ 1), `name`, `synopsis`, `durationMinutes`.
- Un título de serie sin episodios en una temporada debe mostrarse con un mensaje, nunca romper la interfaz (caso límite).

### Row (Fila)
| Campo | Tipo | Reglas |
|---|---|---|
| `id` | `string` | Único. |
| `name` | `string` | Texto visible, p. ej. "Tendencias". |
| `kind` | `'standard' \| 'top10'` | `top10` muestra el número grande y tiene exactamente 10 títulos. |
| `views` | `View[]` | Vistas en las que aparece la fila. |
| `titleIds` | `string[]` | Ids que existen en el catálogo. |

`View` = `'home' \| 'series' \| 'movies' \| 'new'`. Relación con la navegación (FR-026): Inicio → `home`; Series → `series`; Películas → `movies`; Novedades populares → `new`.

### Profile (Perfil)
`id`, `name`, `avatar` (ruta), `isKids: boolean`. Hay exactamente 4 perfiles; uno con `isKids: true`.

### MyList (Mi lista)
Conjunto de `titleId` por perfil. Se guarda como `string[]` en `localStorage`. Sin duplicados; se conserva el orden de adición.

### Notification (Aviso)
`id`, `text`, `date` (texto corto). Hay exactamente 3, estáticos.

## Relaciones

- `Row.titleIds` → `Title.id` (muchos a muchos: un título puede estar en varias filas).
- `MyList` pertenece a un `Profile` y referencia `Title.id`.
- `Title.seasons` contiene `Season`, que contiene `Episode` (solo series).

## Reglas de validación

- Todo id referenciado debe existir en `catalog.json`; una comprobación en tests lo verifica.
- Una fila `top10` tiene 10 ids; las demás, al menos 6.
- El catálogo tiene unos 60 títulos, con películas y series.
- Los datos leídos de `localStorage` se validan: si no son un array de strings o un id de perfil conocido, se descartan y se usan los valores por defecto.

## Transiciones de estado

### Sesión de perfil
`sin perfil` → (elegir perfil) → `perfil activo` → (Cerrar sesión) → `sin perfil`.
El perfil activo se guarda como `nbc:profile`.

### Detalle de título (modal)
`cerrado` → (abrir desde hero, tarjeta o previsualización) → `abierto(titleId)` → (Escape, X o clic fuera) → `cerrado`. Al cerrar, el foco vuelve al elemento de origen.

### Previsualización de tarjeta
`reposo` → (ratón o foco + 400 ms) → `ampliada` → (salir del ratón, perder foco o Escape) → `reposo`. En táctil no existe: el toque abre el detalle.

### Mi lista
`no guardado` ⇄ (alternar) ⇄ `guardado`. Cada cambio se persiste de inmediato.

## Claves de almacenamiento

| Clave | Contenido |
|---|---|
| `nbc:profile` | `string` con el `id` del perfil activo. |
| `nbc:my-list:<profileId>` | `string[]` de ids de títulos. |
| `nbc:volume` | `number` entre 0 y 1 (opcional, volumen del reproductor). |
