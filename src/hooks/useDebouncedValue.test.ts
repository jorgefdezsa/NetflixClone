import { act, renderHook } from '@testing-library/react';
import { useDebouncedValue } from './useDebouncedValue';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('useDebouncedValue', () => {
  it('el valor solo cambia tras el retardo', () => {
    const { result, rerender } = renderHook(({ v }) => useDebouncedValue(v, 250), { initialProps: { v: 'a' } });
    expect(result.current).toBe('a');
    rerender({ v: 'ab' });
    act(() => {
      vi.advanceTimersByTime(249);
    });
    expect(result.current).toBe('a');
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe('ab');
  });

  it('un cambio nuevo reinicia el temporizador', () => {
    const { result, rerender } = renderHook(({ v }) => useDebouncedValue(v, 250), { initialProps: { v: 'a' } });
    rerender({ v: 'ab' });
    act(() => {
      vi.advanceTimersByTime(200);
    });
    rerender({ v: 'abc' });
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe('a');
    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(result.current).toBe('abc');
  });
});
