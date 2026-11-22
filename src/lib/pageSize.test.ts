import { itemsPerPage } from './pageSize';

describe('itemsPerPage', () => {
  it.each([
    [1400, 6],
    [1399, 5],
    [1100, 5],
    [800, 4],
    [500, 3],
    [499, 2],
  ])('ancho %i → %i', (width, expected) => {
    expect(itemsPerPage(width)).toBe(expected);
  });
});
