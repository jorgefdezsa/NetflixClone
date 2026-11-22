import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/renderWithProviders';
import AddToListButton from './AddToListButton';

describe('AddToListButton', () => {
  it('alterna símbolo, aria-pressed y aria-label', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AddToListButton titleId="t-001" />, { profileId: 'p-1' });
    const button = screen.getByTestId('add-to-list');
    expect(button).toHaveTextContent('+');
    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(button).toHaveAttribute('aria-label', 'Añadir a Mi lista');
    await user.click(button);
    expect(button).toHaveTextContent('✓');
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button).toHaveAttribute('aria-label', 'Quitar de Mi lista');
  });

  it('respeta testId', () => {
    renderWithProviders(<AddToListButton titleId="t-001" testId="hero-add" />, { profileId: 'p-1' });
    expect(screen.getByTestId('hero-add')).toBeInTheDocument();
  });

  it('persiste en localStorage', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AddToListButton titleId="t-007" />, { profileId: 'p-2' });
    await user.click(screen.getByTestId('add-to-list'));
    expect(JSON.parse(localStorage.getItem('nbc:my-list:p-2') ?? '[]')).toEqual(['t-007']);
  });
});
