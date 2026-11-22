import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { profiles } from '../data/catalog';
import { readJson, writeJson } from '../lib/storage';
import type { Profile } from '../types';

const KEY = 'nbc:profile';

type ProfileContextValue = {
  profile: Profile | null;
  selectProfile(id: string): void;
  signOut(): void;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

const findProfile = (id: unknown): Profile | null =>
  typeof id === 'string' ? (profiles.find((p) => p.id === id) ?? null) : null;

const isKnownId = (v: unknown): v is string => findProfile(v) !== null;

function readStoredProfile(): Profile | null {
  const id = readJson<string | null>(KEY, null, isKnownId);
  if (id !== null) return findProfile(id);
  // Compatibilidad: id guardado sin comillas JSON (p. ej. por renderWithProviders).
  try {
    return findProfile(localStorage.getItem(KEY));
  } catch {
    return null;
  }
}

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(readStoredProfile);

  const selectProfile = useCallback((id: string) => {
    const next = findProfile(id);
    if (!next) return;
    writeJson(KEY, id);
    setProfile(next);
  }, []);

  const signOut = useCallback(() => {
    try {
      localStorage.removeItem(KEY);
    } catch {
      // Almacenamiento no disponible: se ignora.
    }
    setProfile(null);
  }, []);

  const value = useMemo(() => ({ profile, selectProfile, signOut }), [profile, selectProfile, signOut]);
  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile(): ProfileContextValue {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile debe usarse dentro de ProfileProvider');
  return ctx;
}
