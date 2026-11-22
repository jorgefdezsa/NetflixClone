import { fireEvent, render, renderHook } from '@testing-library/react';
import { usePlayerShortcuts } from './usePlayerShortcuts';

const makeActions = () => ({
  togglePlay: vi.fn(),
  seek: vi.fn(),
  toggleFullscreen: vi.fn(),
  toggleMute: vi.fn(),
  exit: vi.fn(),
});

describe('usePlayerShortcuts', () => {
  it('cada tecla llama a su acción', () => {
    const a = makeActions();
    renderHook(() => usePlayerShortcuts(a));
    fireEvent.keyDown(window, { key: ' ' });
    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    fireEvent.keyDown(window, { key: 'f' });
    fireEvent.keyDown(window, { key: 'F' });
    fireEvent.keyDown(window, { key: 'm' });
    fireEvent.keyDown(window, { key: 'M' });
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(a.togglePlay).toHaveBeenCalledTimes(1);
    expect(a.seek).toHaveBeenNthCalledWith(1, -5);
    expect(a.seek).toHaveBeenNthCalledWith(2, 5);
    expect(a.toggleFullscreen).toHaveBeenCalledTimes(2);
    expect(a.toggleMute).toHaveBeenCalledTimes(2);
    expect(a.exit).toHaveBeenCalledTimes(1);
  });

  it('Espacio hace preventDefault', () => {
    renderHook(() => usePlayerShortcuts(makeActions()));
    const notPrevented = fireEvent.keyDown(window, { key: ' ' });
    expect(notPrevented).toBe(false);
  });

  it('ignora las teclas escritas dentro de un input, select o textarea', () => {
    const a = makeActions();
    renderHook(() => usePlayerShortcuts(a));
    const { getByTestId } = render(
      <>
        <input data-testid="i" />
        <select data-testid="s" />
        <textarea data-testid="t" />
      </>,
    );
    for (const id of ['i', 's', 't']) {
      fireEvent.keyDown(getByTestId(id), { key: ' ' });
      fireEvent.keyDown(getByTestId(id), { key: 'm' });
    }
    expect(a.togglePlay).not.toHaveBeenCalled();
    expect(a.toggleMute).not.toHaveBeenCalled();
  });

  it('Espacio sobre un botón lo deja al propio botón', () => {
    const a = makeActions();
    renderHook(() => usePlayerShortcuts(a));
    const { getByTestId } = render(<button data-testid="b" />);
    fireEvent.keyDown(getByTestId('b'), { key: ' ' });
    expect(a.togglePlay).not.toHaveBeenCalled();
  });

  it('usa siempre las acciones más recientes y limpia el listener', () => {
    const first = makeActions();
    const second = makeActions();
    const { rerender, unmount } = renderHook(({ a }) => usePlayerShortcuts(a), { initialProps: { a: first } });
    rerender({ a: second });
    fireEvent.keyDown(window, { key: 'm' });
    expect(first.toggleMute).not.toHaveBeenCalled();
    expect(second.toggleMute).toHaveBeenCalledTimes(1);
    unmount();
    fireEvent.keyDown(window, { key: 'm' });
    expect(second.toggleMute).toHaveBeenCalledTimes(1);
  });
});
