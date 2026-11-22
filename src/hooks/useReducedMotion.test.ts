import { renderHook } from '@testing-library/react';
import { useReducedMotion } from './useReducedMotion';

const original = window.matchMedia;
const mockMatches = (matches: boolean) => {
  window.matchMedia = ((q: string) => ({
    matches,
    media: q,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent: () => false,
    onchange: null,
  })) as typeof window.matchMedia;
};

afterEach(() => {
  window.matchMedia = original;
});

describe('useReducedMotion', () => {
  it('devuelve true si el usuario prefiere movimiento reducido', () => {
    mockMatches(true);
    expect(renderHook(() => useReducedMotion()).result.current).toBe(true);
  });

  it('devuelve false por defecto', () => {
    mockMatches(false);
    expect(renderHook(() => useReducedMotion()).result.current).toBe(false);
  });
});
