import { screen } from '@testing-library/react';
import { useLocation } from 'react-router-dom';
import { renderWithProviders } from '../test/renderWithProviders';
import SearchPage from './SearchPage';

function LocationDisplay() {
  const { pathname, search } = useLocation();
  return <span data-testid="location">{pathname + search}</span>;
}

const setup = (route: string, profileId = 'p-1') =>
  renderWithProviders(
    <>
      <SearchPage />
      <LocationDisplay />
    </>,
    { profileId, route },
  );

describe('SearchPage', () => {
  it('busca por nombre', () => {
    setup('/search?q=Cruce');
    const cards = screen.getAllByTestId('title-card');
    expect(screen.getByTestId('search-results')).toBeInTheDocument();
    expect(cards.map((c) => c.getAttribute('data-title-id'))).toContain('t-001');
  });

  it('busca por género, sin importar los acentos', () => {
    setup('/search?q=aventura');
    expect(screen.getByTestId('search-results')).toBeInTheDocument();
    expect(screen.getAllByTestId('title-card').length).toBeGreaterThan(1);
  });

  it('busca por actor', () => {
    setup('/search?q=' + encodeURIComponent('Lucía Vera'));
    const ids = screen.getAllByTestId('title-card').map((c) => c.getAttribute('data-title-id'));
    expect(ids).toContain('t-001');
  });

  it('sin coincidencias muestra el mensaje', () => {
    setup('/search?q=zzzzzz');
    expect(screen.getByTestId('search-empty')).toHaveTextContent('zzzzzz');
    expect(screen.queryByTestId('search-results')).toBeNull();
  });

  it('con q vacía redirige a /browse', () => {
    setup('/search?q=');
    expect(screen.getByTestId('location')).toHaveTextContent(/^\/browse$/);
    expect(screen.queryByTestId('search-results')).toBeNull();
  });

  it('el perfil Infantil no recibe resultados no aptos', () => {
    setup('/search?q=Cruce', 'p-4');
    expect(screen.getByTestId('search-empty')).toBeInTheDocument();
  });
});
