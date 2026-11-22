# P12 · US8 Selección de perfil (T105–T112)

**Objetivo**: pantalla "¿Quién está viendo ahora?", perfil recordado, rutas protegidas y perfil Infantil que solo ve `TP` y `7+`.
**Requisito previo**: P11 en verde. Usa `useProfile`, `profiles`, `SafeImage`.

## Test IDs de esta fase
`profile-card`, `browse-empty`.

## T105 · `ProfileGate` [P]
- **Crea**: `src/components/ProfileGate/ProfileGate.tsx` y `ProfileGate.module.css`. Sin props.
- **Render**: `<h1>¿Quién está viendo ahora?</h1>` y, por cada perfil de `profiles`, `<button type="button" data-testid="profile-card">` con `SafeImage` del avatar (128×128, `alt=""`) y el nombre (el Infantil muestra además "Infantil"). Al pulsar: `selectProfile(id)` y `navigate('/browse')`.

## T106 · `ProfilesPage` [P]
- **Crea**: `src/pages/ProfilesPage.tsx`: `<main id="main"><ProfileGate /></main>`.

## T107 · `RequireProfile` [P]
- **Crea**: `src/app/RequireProfile.tsx`: `const { profile } = useProfile(); return profile ? <Outlet /> : <Navigate to="/profiles" replace />;`

## T108 · `HomeRedirect` [P]
- **Crea**: `src/app/HomeRedirect.tsx`: `const { profile } = useProfile(); return <Navigate to={profile ? '/browse' : '/profiles'} replace />;`

## T109 · Rutas con protección
- **Edita**: `src/app/routes.tsx`. Estructura final de `children`:

| Ruta | Elemento | Protegida |
|---|---|---|
| `/` | `<HomeRedirect />` | no |
| `/profiles` | `<ProfilesPage />` | no |
| grupo `{ element: <RequireProfile />, children: […] }` | `/browse`, `/browse/series`, `/browse/movies`, `/browse/new`, `/my-list`, `/search` (y `/watch/:id` en P13) | **sí** |
| `*` | `<Navigate to="/" replace />` | no |

## T110 · `ProfileGate.test.tsx`
- **Crea**: `src/components/ProfileGate/ProfileGate.test.tsx`. Para probar rutas usa `createMemoryRouter(routes, { initialEntries })` + `RouterProvider` dentro de los proveedores (o renderiza `<App />`-equivalente con `MemoryRouter`).
- **Casos**: 4 `profile-card`; pulsar uno guarda `nbc:profile` y navega a `/browse`; con `nbc:profile` preexistente `/` redirige a `/browse`; sin perfil `/browse` redirige a `/profiles`.

## T111 · `BrowsePage.kids.test.tsx`
- **Crea**: `src/pages/BrowsePage.kids.test.tsx`.
- **Casos**: con `profileId: 'p-4'` todo `title-card` tiene un `data-title-id` cuyo título (`getTitle`) es `TP` o `7+`; con `p-1` aparecen también otras clasificaciones; con `p-4` en `/browse/new`, `/browse/series` y `/browse/movies` hay al menos un `row` y no aparece `browse-empty`.

## T112 · GATE US8
- **Ejecuta**: `npm run typecheck && npm test && npm run build`. Commit: `feat(P12): perfiles`.
