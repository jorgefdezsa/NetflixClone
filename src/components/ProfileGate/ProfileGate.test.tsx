import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useLocation, useRoutes } from 'react-router-dom';
import { routes } from '../../app/routes';
import { renderWithProviders } from '../../test/renderWithProviders';

// createMemoryRouter no funciona en jsdom con el fetch de Node (AbortSignal),
// así que se prueban las mismas rutas con MemoryRouter + useRoutes.
function AppRoutes() {
  const { pathname } = useLocation();
  return (
    <>
      {useRoutes(routes)}
      <span data-testid="location">{pathname}</span>
    </>
  );
}

const renderAt = (route: string, profileId?: string) =>
  renderWithProviders(<AppRoutes />, { route, profileId });

const path = () => screen.getByTestId('location').textContent;

describe('ProfileGate y rutas protegidas', () => {
  it('muestra 4 perfiles', () => {
    renderAt('/profiles');
    expect(screen.getAllByTestId('profile-card')).toHaveLength(4);
  });

  it('elegir un perfil lo guarda y navega a /browse', async () => {
    const user = userEvent.setup();
    renderAt('/profiles');
    await user.click(screen.getAllByTestId('profile-card')[1]);
    expect(JSON.parse(localStorage.getItem('nbc:profile') ?? 'null')).toBe('p-2');
    expect(path()).toBe('/browse');
    expect(screen.getByTestId('app-header')).toBeInTheDocument();
  });

  it('con perfil guardado, / redirige a /browse', () => {
    renderAt('/', 'p-1');
    expect(path()).toBe('/browse');
  });

  it('sin perfil, / redirige a /profiles', () => {
    renderAt('/');
    expect(path()).toBe('/profiles');
  });

  it('sin perfil, /browse redirige a /profiles', () => {
    renderAt('/browse');
    expect(path()).toBe('/profiles');
    expect(screen.getAllByTestId('profile-card')).toHaveLength(4);
  });

  it.each(['/browse/series', '/browse/movies', '/browse/new', '/my-list', '/search?q=a'])(
    'sin perfil, %s redirige a /profiles',
    (route) => {
      renderAt(route);
      expect(path()).toBe('/profiles');
    },
  );

  it('con perfil, una ruta desconocida acaba en /browse', () => {
    renderAt('/nada', 'p-3');
    expect(path()).toBe('/browse');
  });

  it('sin perfil, una ruta desconocida acaba en /profiles', () => {
    renderAt('/nada');
    expect(path()).toBe('/profiles');
  });
});
