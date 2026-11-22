import type { Title } from '../types';
import { similarTitles } from './similarTitles';

const title = (id: string, name: string, genres: string[]): Title => ({
  id, type: 'movie', name, synopsis: '', year: 2020, rating: 'TP', durationMinutes: 90,
  genres, cast: [], poster: '', banner: '', addedAt: '2024-01-01',
});

const base = title('x', 'Base', ['Acción', 'Drama', 'Thriller']);
const all = [
  base,
  title('a', 'Zeta', ['Acción']),
  title('b', 'Alfa', ['Acción']),
  title('c', 'Media', ['Acción', 'Drama']),
  title('d', 'Otra', ['Comedia']),
  title('e', 'Triple', ['Acción', 'Drama', 'Thriller']),
];
const ids = (r: Title[]) => r.map((t) => t.id);

describe('similarTitles', () => {
  it('excluye el propio título y los que no comparten género', () => {
    const r = ids(similarTitles(base, all));
    expect(r).not.toContain('x');
    expect(r).not.toContain('d');
  });

  it('ordena por géneros compartidos y luego por nombre', () => {
    expect(ids(similarTitles(base, all))).toEqual(['e', 'c', 'b', 'a']);
  });

  it('respeta el límite', () => {
    expect(ids(similarTitles(base, all, 2))).toEqual(['e', 'c']);
  });
});
