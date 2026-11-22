import { act, renderHook } from '@testing-library/react';
import type { KeyboardEvent } from 'react';
import { useHoverPreview } from './useHoverPreview';

const original = window.matchMedia;

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  window.matchMedia = original;
});

describe('useHoverPreview', () => {
  it('abre a los 400 ms y no antes', () => {
    const { result } = renderHook(() => useHoverPreview());
    act(() => result.current.handlers.onMouseEnter());
    act(() => {
      vi.advanceTimersByTime(399);
    });
    expect(result.current.open).toBe(false);
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current.open).toBe(true);
  });

  it('mouseleave antes del retardo cancela la apertura', () => {
    const { result } = renderHook(() => useHoverPreview());
    act(() => result.current.handlers.onMouseEnter());
    act(() => result.current.handlers.onMouseLeave());
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.open).toBe(false);
  });

  it('Escape cierra', () => {
    const { result } = renderHook(() => useHoverPreview());
    act(() => result.current.handlers.onFocus());
    act(() => {
      vi.advanceTimersByTime(400);
    });
    expect(result.current.open).toBe(true);
    act(() => result.current.handlers.onKeyDown({ key: 'Escape' } as KeyboardEvent));
    expect(result.current.open).toBe(false);
  });

  it('con (hover: none) nunca abre', () => {
    window.matchMedia = ((q: string) => ({
      matches: q === '(hover: none)',
      media: q,
      addEventListener() {},
      removeEventListener() {},
      addListener() {},
      removeListener() {},
      dispatchEvent: () => false,
      onchange: null,
    })) as typeof window.matchMedia;
    const { result } = renderHook(() => useHoverPreview());
    act(() => result.current.handlers.onMouseEnter());
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.open).toBe(false);
  });
});
