import type { Title } from '../types';
import { searchTitles } from './searchTitles';

const title = (id: string, name: string, genres: string[], cast: string[]): Title => ({
  id, type: 'movie', name, synopsis: '', year: 2020, rating: 'TP', durationMinutes: 90,
  genres, cast, poster: '', banner: '', addedAt: '2024-01-01',
});

const titles = [
  title('a', 'El Gran Robo', ['Acción'], ['Ana Pérez']),
  title('b', 'Noches de Verano', ['Drama'], ['Luis Gómez']),
  title('c', 'Risas', ['Comedia'], ['Marta Ruiz']),
];
const ids = (r: Title[]) => r.map((t) => t.id);

describe('searchTitles', () => {
  it('encuentra por nombre', () => {
    expect(ids(searchTitles('verano', titles))).toEqual(['b']);
  });

  it('encuentra por género', () => {
    expect(ids(searchTitles('comedia', titles))).toEqual(['c']);
  });

  it('encuentra por actor', () => {
    expect(ids(searchTitles('gómez', titles))).toEqual(['b']);
  });

  it('ignora acentos', () => {
    expect(ids(searchTitles('accion', titles))).toEqual(['a']);
    expect(ids(searchTitles('perez', titles))).toEqual(['a']);
  });

  it('consulta vacía o con espacios devuelve []', () => {
    expect(searchTitles('', titles)).toEqual([]);
    expect(searchTitles('   ', titles)).toEqual([]);
  });
});
