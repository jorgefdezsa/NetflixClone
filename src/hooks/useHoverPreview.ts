import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';

export function useHoverPreview(delayMs = 400): {
  open: boolean;
  handlers: {
    onMouseEnter(): void;
    onMouseLeave(): void;
    onFocus(): void;
    onBlur(): void;
    onKeyDown(e: KeyboardEvent): void;
  };
  close(): void;
} {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancel = useCallback(() => {
    if (timer.current !== null) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  const close = useCallback(() => {
    cancel();
    setOpen(false);
  }, [cancel]);

  const schedule = useCallback(() => {
    if (window.matchMedia('(hover: none)').matches) return;
    cancel();
    timer.current = setTimeout(() => {
      timer.current = null;
      setOpen(true);
    }, delayMs);
  }, [cancel, delayMs]);

  useEffect(() => cancel, [cancel]);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    },
    [close],
  );

  return {
    open,
    handlers: { onMouseEnter: schedule, onMouseLeave: close, onFocus: schedule, onBlur: close, onKeyDown },
    close,
  };
}
