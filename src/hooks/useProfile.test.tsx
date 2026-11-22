import { act, renderHook } from '@testing-library/react';
import { ProfileProvider, useProfile } from './useProfile';

const setup = () => renderHook(() => useProfile(), { wrapper: ProfileProvider });

describe('useProfile', () => {
  it('sin clave guardada devuelve null', () => {
    expect(setup().result.current.profile).toBeNull();
  });

  it('selectProfile persiste y devuelve el perfil', () => {
    const { result } = setup();
    act(() => result.current.selectProfile('p-2'));
    expect(result.current.profile?.name).toBe('Ana');
    expect(setup().result.current.profile?.name).toBe('Ana');
  });

  it('id desconocido en la clave devuelve null', () => {
    localStorage.setItem('nbc:profile', JSON.stringify('p-99'));
    expect(setup().result.current.profile).toBeNull();
  });

  it('acepta el id guardado sin comillas JSON', () => {
    localStorage.setItem('nbc:profile', 'p-3');
    expect(setup().result.current.profile?.name).toBe('Marcos');
  });

  it('signOut limpia el perfil y la clave', () => {
    const { result } = setup();
    act(() => result.current.selectProfile('p-1'));
    act(() => result.current.signOut());
    expect(result.current.profile).toBeNull();
    expect(localStorage.getItem('nbc:profile')).toBeNull();
  });

  it('lanza fuera del proveedor', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useProfile())).toThrow();
    vi.restoreAllMocks();
  });
});
