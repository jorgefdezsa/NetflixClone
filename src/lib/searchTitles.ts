import type { Title } from '../types';

const normalize = (s: string): string =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export function searchTitles(query: string, titles: Title[]): Title[] {
  const q = normalize(query.trim());
  if (q === '') return [];
  const has = (s: string) => normalize(s).includes(q);
  return titles.filter((t) => has(t.name) || t.genres.some(has) || t.cast.some(has));
}
