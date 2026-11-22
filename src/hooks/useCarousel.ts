import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { itemsPerPage } from '../lib/pageSize';
import { useReducedMotion } from './useReducedMotion';

export function useCarousel(itemCount: number): {
  ref: RefObject<HTMLUListElement>;
  canPrev: boolean;
  canNext: boolean;
  prev(): void;
  next(): void;
  perPage: number;
} {
  const ref = useRef<HTMLUListElement>(null);
  const reduced = useReducedMotion();
  const [perPage, setPerPage] = useState(() => itemsPerPage(window.innerWidth));
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 0);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const el = ref.current;
    const onResize = () => {
      setPerPage(itemsPerPage(window.innerWidth));
      update();
    };
    update();
    el?.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      el?.removeEventListener('scroll', update);
      window.removeEventListener('resize', onResize);
    };
  }, [itemCount, update]);

  const scrollPage = useCallback(
    (direction: -1 | 1) => {
      const el = ref.current;
      if (!el) return;
      el.scrollBy({ left: direction * el.clientWidth, behavior: reduced ? 'auto' : 'smooth' });
    },
    [reduced],
  );

  const prev = useCallback(() => scrollPage(-1), [scrollPage]);
  const next = useCallback(() => scrollPage(1), [scrollPage]);

  return { ref, canPrev, canNext, prev, next, perPage };
}
