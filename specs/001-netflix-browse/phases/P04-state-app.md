# P04 · Estado, componentes compartidos y esqueleto de la app (T035–T049)

**Objetivo**: contextos de perfil, Mi lista y modal; `SafeImage`; `AddToListButton`; router mínimo.
**Requisito previo**: P03 en verde. Usa `readJson`/`writeJson` (`src/lib/storage.ts`) y `profiles` (`src/data/catalog.ts`).

## T035 · `useProfile`
- **Crea**: `src/hooks/useProfile.tsx`.
- **Exporta**: `ProfileProvider({ children })` y `useProfile(): { profile: Profile | null; selectProfile(id: string): void; signOut(): void }`.
- **Reglas**: clave `nbc:profile` (string con el id). Al iniciar: `readJson` con guard "es string y existe en `profiles`"; si no → `null`. `selectProfile` guarda y actualiza el estado. `signOut` borra la clave (`localStorage.removeItem`) y pone `null`. `useProfile` lanza un `Error` si se usa fuera del proveedor.

## T036 · Prueba de `useProfile`
- **Crea**: `src/hooks/useProfile.test.tsx` (usa `renderHook` con el proveedor como `wrapper`).
- **Casos**: sin clave → `null`; `selectProfile('p-2')` persiste y devuelve Ana; clave con id desconocido → `null`; `signOut` limpia.

## T037 · `useMyList`
- **Crea**: `src/hooks/useMyList.tsx`.
- **Exporta**: `MyListProvider({ children })` y `useMyList(): { ids: string[]; has(id: string): boolean; toggle(id: string): void }`.
- **Reglas**: clave `nbc:my-list:<profileId>` (sin perfil: `nbc:my-list:anon`) con un `string[]`; sin duplicados; conserva el orden de adición; JSON corrupto → `[]`. Debe releer cuando cambia el perfil activo (`useProfile`). `MyListProvider` va **dentro** de `ProfileProvider`.

## T038 · Prueba de `useMyList`
- **Crea**: `src/hooks/useMyList.test.tsx`.
- **Casos**: alternar añade y quita; persiste al desmontar y volver a montar; listas separadas por perfil; JSON corrupto → `[]`.

## T039 · `useTitleModal`
- **Crea**: `src/hooks/useTitleModal.tsx`.
- **Exporta**: `TitleModalProvider({ children })` y `useTitleModal(): { current: Title | null; open(title: Title): void; close(): void }`.
- **Solo estado**: sin interfaz. Lanza `Error` fuera del proveedor.

## T040 · `SafeImage`
- **Crea**: `src/components/SafeImage/SafeImage.tsx`.
- **Contrato**:
  ```tsx
  type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt' | 'width' | 'height'> & {
    src: string; alt: string; width: number; height: number;
  };
  export default function SafeImage(props: Props)
  ```
- **Reglas**: renderiza `<img loading="lazy" {...props} onError={…}>`. `onError`: si `!e.currentTarget.src.endsWith('/assets/placeholder.svg')` → `e.currentTarget.src = '/assets/placeholder.svg'` (la guarda evita un bucle). Después llama al `onError` recibido, si existe. `loading` puede sobrescribirse con `loading="eager"`.

## T041 · Prueba de `SafeImage`
- **Crea**: `src/components/SafeImage/SafeImage.test.tsx`.
- **Casos**: pasa `src`, `alt`, `width`, `height` y `loading="lazy"` por defecto; al disparar `error` cambia a `/assets/placeholder.svg` y un segundo `error` no vuelve a cambiarlo. Usa `data-testid="img"` pasado como prop.

## T042 · `AddToListButton`
- **Crea**: `src/components/AddToListButton/AddToListButton.tsx` y `AddToListButton.module.css`.
- **Props**: `{ titleId: string; testId?: string }` (por defecto `'add-to-list'`).
- **Render**: `<button type="button" data-testid={testId} aria-pressed={has(titleId)} aria-label={…} onClick={() => toggle(titleId)}>` con texto `✓` si está guardado, `+` si no. `aria-label` = `"Quitar de Mi lista"` o `"Añadir a Mi lista"`.

## T043 · Prueba de `AddToListButton`
- **Crea**: `src/components/AddToListButton/AddToListButton.test.tsx`.
- **Casos**: alterna símbolo y `aria-label`; respeta `testId`; persiste en `localStorage`.

## T044 · `RootLayout`
- **Crea**: `src/app/RootLayout.tsx` — `export default function RootLayout() { return <Outlet />; }` (de `react-router-dom`).

## T045 · `routes.tsx`
- **Crea**: `src/app/routes.tsx`.
- **Contrato**: `export const routes: RouteObject[] = [{ element: <RootLayout />, children: [{ path: '/', element: <p>Netflix Browse Clone</p> }] }];`
- Las historias siguientes añaden rutas dentro de `children`.

## T046 · `App`
- **Crea**: `src/app/App.tsx` — `export default function App()` que devuelve:
  `<ProfileProvider><MyListProvider><TitleModalProvider><RouterProvider router={router} /></TitleModalProvider></MyListProvider></ProfileProvider>`
- `const router = createBrowserRouter(routes)` se crea **fuera** del componente.

## T047 · `main.tsx`
- **Reescribe**: `src/main.tsx`: importa `./styles/global.css` y `App`; `createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)`.

## T048 · `renderWithProviders`
- **Crea**: `src/test/renderWithProviders.tsx`.
- **Firma**: `renderWithProviders(ui: ReactElement, options?: { route?: string; profileId?: string })`; `route` por defecto `'/browse'`.
- **Hace**: si hay `profileId`, escribe `localStorage.setItem('nbc:profile', profileId)` **antes** de renderizar; envuelve `ui` en `ProfileProvider` > `MyListProvider` > `TitleModalProvider` > `MemoryRouter initialEntries={[route]}`; devuelve el resultado de `render`.

## T049 · GATE P04
- **Ejecuta**: `npm run typecheck && npm test && npm run build`. Commit: `feat(P04): estado y esqueleto`.
- **Hecho cuando**: verde y `npm run dev` arranca mostrando "Netflix Browse Clone".
