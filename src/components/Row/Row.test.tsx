import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rows, titles } from '../../data/catalog';
import { renderWithProviders } from '../../test/renderWithProviders';
import type { Row as RowType } from '../../types';
import Row from './Row';

const standard: RowType = { id: 'r-test', name: 'Prueba', kind: 'standard', views: ['home'], titleIds: [] };
const top10 = rows.find((r) => r.id === 'r-top10')!;

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Row', () => {
  it('muestra una tarjeta por título', () => {
    renderWithProviders(<Row row={standard} titles={titles.slice(0, 12)} />, { profileId: 'p-1' });
    expect(screen.getByTestId('row-title')).toHaveTextContent('Prueba');
    expect(screen.getAllByTestId('title-card')).toHaveLength(12);
    expect(screen.queryAllByTestId('top10-rank')).toHaveLength(0);
  });

  it('la flecha anterior está deshabilitada al inicio', () => {
    renderWithProviders(<Row row={standard} titles={titles.slice(0, 12)} />, { profileId: 'p-1' });
    expect(screen.getByTestId('row-prev')).toBeDisabled();
  });

  it('la fila top10 muestra los números 1…10', () => {
    renderWithProviders(<Row row={top10} titles={titles.slice(0, 10)} />, { profileId: 'p-1' });
    const ranks = screen.getAllByTestId('top10-rank').map((el) => el.textContent);
    expect(ranks).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
  });

  it('una fila sin títulos no se renderiza', () => {
    renderWithProviders(<Row row={standard} titles={[]} />, { profileId: 'p-1' });
    expect(screen.queryByTestId('row')).toBeNull();
  });

  it('ArrowRight en la lista desplaza la fila', async () => {
    const user = userEvent.setup();
    const scrollBy = vi.spyOn(Element.prototype, 'scrollBy').mockImplementation(() => {});
    renderWithProviders(<Row row={standard} titles={titles.slice(0, 12)} />, { profileId: 'p-1' });
    screen.getAllByTestId('title-card')[0].querySelector('button')!.focus();
    await user.keyboard('{ArrowRight}');
    expect(scrollBy).toHaveBeenCalledTimes(1);
  });
});
