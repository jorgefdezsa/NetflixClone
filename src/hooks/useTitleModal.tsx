import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Title } from '../types';

type TitleModalContextValue = {
  current: Title | null;
  open(title: Title): void;
  close(): void;
};

const TitleModalContext = createContext<TitleModalContextValue | null>(null);

export function TitleModalProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<Title | null>(null);
  const open = useCallback((title: Title) => setCurrent(title), []);
  const close = useCallback(() => setCurrent(null), []);
  const value = useMemo(() => ({ current, open, close }), [current, open, close]);
  return <TitleModalContext.Provider value={value}>{children}</TitleModalContext.Provider>;
}

export function useTitleModal(): TitleModalContextValue {
  const ctx = useContext(TitleModalContext);
  if (!ctx) throw new Error('useTitleModal debe usarse dentro de TitleModalProvider');
  return ctx;
}
