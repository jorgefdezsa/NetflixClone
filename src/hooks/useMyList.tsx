import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { readJson, writeJson } from '../lib/storage';
import { useProfile } from './useProfile';

type MyListContextValue = {
  ids: string[];
  has(id: string): boolean;
  toggle(id: string): void;
};

const MyListContext = createContext<MyListContextValue | null>(null);

const isStringArray = (v: unknown): v is string[] =>
  Array.isArray(v) && v.every((x) => typeof x === 'string');

const readList = (key: string): string[] => [...new Set(readJson<string[]>(key, [], isStringArray))];

export function MyListProvider({ children }: { children: ReactNode }) {
  const { profile } = useProfile();
  const key = `nbc:my-list:${profile?.id ?? 'anon'}`;
  const [state, setState] = useState(() => ({ key, ids: readList(key) }));

  // Si cambia el perfil activo, se relee la lista durante el propio render.
  let current = state;
  if (state.key !== key) {
    current = { key, ids: readList(key) };
    setState(current);
  }
  const { ids } = current;

  const toggle = useCallback(
    (id: string) => {
      setState((prev) => {
        const next = prev.ids.includes(id) ? prev.ids.filter((x) => x !== id) : [...prev.ids, id];
        writeJson(prev.key, next);
        return { key: prev.key, ids: next };
      });
    },
    [],
  );

  const has = useCallback((id: string) => ids.includes(id), [ids]);
  const value = useMemo(() => ({ ids, has, toggle }), [ids, has, toggle]);
  return <MyListContext.Provider value={value}>{children}</MyListContext.Provider>;
}

export function useMyList(): MyListContextValue {
  const ctx = useContext(MyListContext);
  if (!ctx) throw new Error('useMyList debe usarse dentro de MyListProvider');
  return ctx;
}
