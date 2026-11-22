import { act, fireEvent, render, screen } from '@testing-library/react';
import { useCarousel } from './useCarousel';

let metrics = { scrollLeft: 0, clientWidth: 500, scrollWidth: 1500 };

function Harness({ count = 12 }: { count?: number }) {
  const { ref, canPrev, canNext, prev, next, perPage } = useCarousel(count);
  return (
    <div>
      <ul ref={ref} data-testid="list" />
      <button data-testid="prev" disabled={!canPrev} onClick={prev} />
      <button data-testid="next" disabled={!canNext} onClick={next} />
      <span data-testid="per-page">{perPage}</span>
    </div>
  );
}

beforeEach(() => {
  metrics = { scrollLeft: 0, clientWidth: 500, scrollWidth: 1500 };
  for (const key of ['scrollLeft', 'clientWidth', 'scrollWidth'] as const) {
    Object.defineProperty(HTMLElement.prototype, key, {
      configurable: true,
      get: () => metrics[key],
    });
  }
});

afterEach(() => {
  for (const key of ['scrollLeft', 'clientWidth', 'scrollWidth']) {
    delete (HTMLElement.prototype as unknown as Record<string, unknown>)[key];
  }
  vi.restoreAllMocks();
});

describe('useCarousel', () => {
  it('al inicio solo se puede avanzar', () => {
    render(<Harness />);
    expect(screen.getByTestId('prev')).toBeDisabled();
    expect(screen.getByTestId('next')).toBeEnabled();
  });

  it('en el extremo final solo se puede retroceder', () => {
    render(<Harness />);
    act(() => {
      metrics.scrollLeft = 1000;
      fireEvent.scroll(screen.getByTestId('list'));
    });
    expect(screen.getByTestId('prev')).toBeEnabled();
    expect(screen.getByTestId('next')).toBeDisabled();
  });

  it('next() y prev() llaman a scrollBy con el ancho visible', () => {
    const scrollBy = vi.spyOn(Element.prototype, 'scrollBy').mockImplementation(() => {});
    render(<Harness />);
    fireEvent.click(screen.getByTestId('next'));
    expect(scrollBy).toHaveBeenLastCalledWith({ left: 500, behavior: 'smooth' });
    act(() => {
      metrics.scrollLeft = 500;
      fireEvent.scroll(screen.getByTestId('list'));
    });
    fireEvent.click(screen.getByTestId('prev'));
    expect(scrollBy).toHaveBeenLastCalledWith({ left: -500, behavior: 'smooth' });
  });

  it('recalcula perPage al redimensionar', () => {
    window.innerWidth = 1500;
    render(<Harness />);
    expect(screen.getByTestId('per-page')).toHaveTextContent('6');
    act(() => {
      window.innerWidth = 600;
      fireEvent(window, new Event('resize'));
    });
    expect(screen.getByTestId('per-page')).toHaveTextContent('3');
  });

  it('sin desbordamiento no se puede avanzar', () => {
    metrics.scrollWidth = 500;
    render(<Harness />);
    expect(screen.getByTestId('next')).toBeDisabled();
  });
});
