import { screen } from '@testing-library/react';
import { renderWithProviders } from '../test/renderWithProviders';
import MyListPage from './MyListPage';

describe('MyListPage', () => {
  it('con la lista vacía muestra el mensaje', () => {
    renderWithProviders(<MyListPage />, { profileId: 'p-1', route: '/my-list' });
    expect(screen.getByTestId('my-list-empty')).toBeInTheDocument();
    expect(screen.queryAllByTestId('title-card')).toHaveLength(0);
  });

  it('muestra los títulos guardados', () => {
    localStorage.setItem('nbc:my-list:p-1', JSON.stringify(['t-001', 't-002']));
    renderWithProviders(<MyListPage />, { profileId: 'p-1', route: '/my-list' });
    expect(screen.getAllByTestId('title-card')).toHaveLength(2);
    expect(screen.queryByTestId('my-list-empty')).toBeNull();
  });

  it('el perfil Infantil no ve títulos de clasificación no apta', () => {
    localStorage.setItem('nbc:my-list:p-4', JSON.stringify(['t-001', 't-002', 't-011']));
    renderWithProviders(<MyListPage />, { profileId: 'p-4', route: '/my-list' });
    const cards = screen.getAllByTestId('title-card');
    expect(cards).toHaveLength(1);
    expect(cards[0]).toHaveAttribute('data-title-id', 't-011');
  });

  it('si todos los guardados son no aptos muestra el mensaje de vacío', () => {
    localStorage.setItem('nbc:my-list:p-4', JSON.stringify(['t-001', 't-002']));
    renderWithProviders(<MyListPage />, { profileId: 'p-4', route: '/my-list' });
    expect(screen.getByTestId('my-list-empty')).toBeInTheDocument();
  });
});
