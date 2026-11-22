import type { Title } from '../types';

export function similarTitles(title: Title, all: Title[], limit = 6): Title[] {
  const shared = (t: Title) => t.genres.filter((g) => title.genres.includes(g)).length;
  return all
    .filter((t) => t.id !== title.id)
    .map((t) => ({ t, n: shared(t) }))
    .filter(({ n }) => n >= 1)
    .sort((a, b) => b.n - a.n || a.t.name.localeCompare(b.t.name, 'es'))
    .slice(0, limit)
    .map(({ t }) => t);
}
