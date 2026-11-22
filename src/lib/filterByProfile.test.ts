import type { Profile, Rating, Title } from '../types';
import { filterByProfile } from './filterByProfile';

const title = (id: string, rating: Rating): Title => ({
  id, type: 'movie', name: id, synopsis: '', year: 2020, rating, durationMinutes: 90,
  genres: [], cast: [], poster: '', banner: '', addedAt: '2024-01-01',
});

const titles = [title('a', 'TP'), title('b', '7+'), title('c', '12+'), title('d', '18+')];
const adult: Profile = { id: 'p-1', name: 'Adulto', avatar: '', isKids: false };
const kids: Profile = { id: 'p-2', name: 'Infantil', avatar: '', isKids: true };

describe('filterByProfile', () => {
  it('sin perfil devuelve todos', () => {
    expect(filterByProfile(titles, null)).toBe(titles);
  });

  it('perfil adulto devuelve todos', () => {
    expect(filterByProfile(titles, adult)).toBe(titles);
  });

  it('perfil infantil deja solo TP y 7+', () => {
    expect(filterByProfile(titles, kids).map((t) => t.id)).toEqual(['a', 'b']);
  });
});
