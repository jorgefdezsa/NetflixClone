import { useEffect, useRef } from 'react';

type Actions = {
  togglePlay(): void;
  seek(seconds: number): void;
  toggleFullscreen(): void;
  toggleMute(): void;
  exit(): void;
};

const IGNORED_TAGS = ['INPUT', 'SELECT', 'TEXTAREA'];

export function usePlayerShortcuts(actions: Actions): void {
  const ref = useRef(actions);

  useEffect(() => {
    ref.current = actions;
  });

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && IGNORED_TAGS.includes(target.tagName)) return;
      const a = ref.current;

      switch (e.key) {
        case ' ':
          // Sobre un botón, Espacio ya lo activa el propio botón: evita alternar dos veces.
          if (target?.tagName === 'BUTTON') return;
          e.preventDefault();
          a.togglePlay();
          break;
        case 'ArrowLeft':
          a.seek(-5);
          break;
        case 'ArrowRight':
          a.seek(5);
          break;
        case 'f':
        case 'F':
          a.toggleFullscreen();
          break;
        case 'm':
        case 'M':
          a.toggleMute();
          break;
        case 'Escape':
          a.exit();
          break;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);
}
