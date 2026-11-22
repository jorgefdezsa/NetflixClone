import { act, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/renderWithProviders';
import Header from './Header';

const setup = () => renderWithProviders(<Header />, { profileId: 'p-1' });

describe('Header', () => {
  it('muestra los 5 enlaces con su href y texto', () => {
    setup();
    const expected: Array<[string, string, string]> = [
      ['nav-home', '/browse', 'Inicio'],
      ['nav-series', '/browse/series', 'Series'],
      ['nav-movies', '/browse/movies', 'Películas'],
      ['nav-new', '/browse/new', 'Novedades populares'],
      ['nav-my-list', '/my-list', 'Mi lista'],
    ];
    for (const [id, href, text] of expected) {
      expect(screen.getByTestId(id)).toHaveAttribute('href', href);
      expect(screen.getByTestId(id)).toHaveTextContent(text);
    }
  });

  it('abre el panel de notificaciones y Escape lo cierra', async () => {
    const user = userEvent.setup();
    setup();
    expect(screen.queryByTestId('notifications-panel')).toBeNull();
    await user.click(screen.getByTestId('notifications-toggle'));
    expect(screen.getByTestId('notifications-panel')).toBeInTheDocument();
    expect(screen.getAllByTestId('notification-item')).toHaveLength(3);
    await user.keyboard('{Escape}');
    expect(screen.queryByTestId('notifications-panel')).toBeNull();
  });

  it('alterna aria-expanded del botón de menú', async () => {
    const user = userEvent.setup();
    setup();
    const toggle = screen.getByTestId('nav-menu-toggle');
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  it('se vuelve sólida al hacer scroll', () => {
    setup();
    expect(screen.getByTestId('app-header').className).not.toContain('solid');
    act(() => {
      window.scrollY = 50;
      fireEvent.scroll(window);
    });
    expect(screen.getByTestId('app-header').className).toContain('solid');
    window.scrollY = 0;
  });

  it('el menú de perfil muestra 4 perfiles y cerrar sesión', async () => {
    const user = userEvent.setup();
    setup();
    await user.click(screen.getByTestId('profile-menu-toggle'));
    expect(screen.getByTestId('profile-menu')).toBeInTheDocument();
    expect(screen.getAllByTestId('profile-option')).toHaveLength(4);
    expect(screen.getByTestId('sign-out')).toBeInTheDocument();
  });
});
