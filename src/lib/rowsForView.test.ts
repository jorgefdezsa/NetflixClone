import type { Row, View } from '../types';
import { rowsForView } from './rowsForView';

const row = (id: string, views: View[]): Row => ({ id, name: id, kind: 'standard', views, titleIds: [] });

const rows = [row('r1', ['home', 'series']), row('r2', ['movies']), row('r3', ['home', 'new'])];

describe('rowsForView', () => {
  it('devuelve las filas de la vista en el orden original', () => {
    expect(rowsForView(rows, 'home').map((r) => r.id)).toEqual(['r1', 'r3']);
  });

  it('devuelve [] si ninguna fila pertenece a la vista', () => {
    expect(rowsForView([row('r2', ['movies'])], 'series')).toEqual([]);
  });
});
