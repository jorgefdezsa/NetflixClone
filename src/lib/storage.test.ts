import { readJson, writeJson } from './storage';

const isStringArray = (v: unknown): v is string[] =>
  Array.isArray(v) && v.every((x) => typeof x === 'string');

describe('storage', () => {
  it('lee un valor válido escrito con writeJson', () => {
    writeJson('k', ['a', 'b']);
    expect(readJson('k', [], isStringArray)).toEqual(['a', 'b']);
  });

  it('devuelve el fallback si la clave no existe', () => {
    expect(readJson('ausente', ['x'], isStringArray)).toEqual(['x']);
  });

  it('devuelve el fallback si el JSON está roto', () => {
    localStorage.setItem('k', '{roto');
    expect(readJson('k', [], isStringArray)).toEqual([]);
  });

  it('devuelve el fallback si el tipo no es válido', () => {
    localStorage.setItem('k', JSON.stringify({ a: 1 }));
    expect(readJson('k', [], isStringArray)).toEqual([]);
  });

  it('writeJson no lanza aunque setItem falle', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('lleno');
    });
    expect(() => writeJson('k', 1)).not.toThrow();
    spy.mockRestore();
  });
});
