// Contrato de tipos del dominio. Fuente normativa: no cambiar nombres sin actualizar spec y plan.
// Se copia a src/types/index.ts durante la implementación.

export type TitleType = 'movie' | 'series';

export type Rating = 'TP' | '7+' | '12+' | '16+' | '18+';

/** Edades aptas para el perfil Infantil (spec FR-021). */
export const KIDS_RATINGS: readonly Rating[] = ['TP', '7+'];

export interface Episode {
  number: number;
  name: string;
  synopsis: string;
  durationMinutes: number;
}

export interface Season {
  number: number;
  episodes: Episode[];
}

export interface Title {
  id: string;
  type: TitleType;
  name: string;
  synopsis: string;
  year: number;
  rating: Rating;
  /** Obligatorio si type === 'movie'. */
  durationMinutes?: number;
  /** Obligatorio y no vacío si type === 'series'. */
  seasons?: Season[];
  genres: string[];
  cast: string[];
  poster: string;
  banner: string;
  logo?: string;
  /** Fecha ISO YYYY-MM-DD. */
  addedAt: string;
}

export type View = 'home' | 'series' | 'movies' | 'new';

export type RowKind = 'standard' | 'top10';

export interface Row {
  id: string;
  name: string;
  kind: RowKind;
  views: View[];
  titleIds: string[];
}

export interface Profile {
  id: string;
  name: string;
  avatar: string;
  isKids: boolean;
}

export interface Notification {
  id: string;
  text: string;
  date: string;
}
