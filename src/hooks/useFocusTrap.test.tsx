import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useFocusTrap } from './useFocusTrap';

function Harness() {
  const ref = useFocusTrap(true);
  return (
    <div ref={ref}>
      <button data-testid="b1">1</button>
      <button data-testid="b2">2</button>
      <button data-testid="b3">3</button>
    </div>
  );
}

describe('useFocusTrap', () => {
  it('Tab desde el último vuelve al primero', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    screen.getByTestId('b3').focus();
    await user.tab();
    expect(screen.getByTestId('b1')).toHaveFocus();
  });

  it('Shift+Tab desde el primero va al último', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    screen.getByTestId('b1').focus();
    await user.tab({ shift: true });
    expect(screen.getByTestId('b3')).toHaveFocus();
  });

  it('Tab en medio avanza con normalidad', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    screen.getByTestId('b1').focus();
    await user.tab();
    expect(screen.getByTestId('b2')).toHaveFocus();
  });
});
