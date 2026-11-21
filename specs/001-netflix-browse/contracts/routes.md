# Contrato de rutas

| Ruta | Página | Notas |
|---|---|---|
| `/` | redirección | Sin perfil guardado → `/profiles`; con perfil → `/browse`. |
| `/profiles` | `ProfilesPage` | Elegir perfil lleva a `/browse`. |
| `/browse` | `BrowsePage view="home"` | Hero y todas las filas con vista `home`. |
| `/browse/series` | `BrowsePage view="series"` | Solo filas con vista `series`. |
| `/browse/movies` | `BrowsePage view="movies"` | Solo filas con vista `movies`. |
| `/browse/new` | `BrowsePage view="new"` | Filas con vista `new` (lo más reciente). |
| `/search?q=<texto>` | `SearchPage` | Vaciar `q` vuelve a `/browse`. |
| `/my-list` | `MyListPage` | Cuadrícula o mensaje `my-list-empty`. |
| `/watch/:id` | `WatchPage` | Carga `Player` con el título `id`; id inexistente → redirige a `/browse`. |

Reglas:
- Las rutas distintas de `/profiles` requieren perfil activo; si no hay, redirigen a `/profiles`.
- "Cerrar sesión" borra `nbc:profile` y navega a `/profiles`.
- El detalle de título es un modal sobre la página actual, no tiene ruta propia.
