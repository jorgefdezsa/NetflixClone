import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MyListProvider, useMyList } from './useMyList';
import { ProfileProvider, useProfile } from './useProfile';

const wrapper = ({ children }: { children: ReactNode }) => (
  <ProfileProvider>
    <MyListProvider>{children}</MyListProvider>
  </ProfileProvider>
);

const setup = () => renderHook(() => ({ list: useMyList(), profile: useProfile() }), { wrapper });

describe('useMyList', () => {
  it('toggle añade y quita sin duplicados, en orden de adición', () => {
    const { result } = setup();
    act(() => result.current.list.toggle('t-002'));
    act(() => result.current.list.toggle('t-001'));
    expect(result.current.list.ids).toEqual(['t-002', 't-001']);
    expect(result.current.list.has('t-001')).toBe(true);
    act(() => result.current.list.toggle('t-002'));
    expect(result.current.list.ids).toEqual(['t-001']);
    expect(result.current.list.has('t-002')).toBe(false);
  });

  it('persiste al desmontar y volver a montar', () => {
    const first = setup();
    act(() => first.result.current.list.toggle('t-005'));
    first.unmount();
    expect(setup().result.current.list.ids).toEqual(['t-005']);
  });

  it('mantiene listas separadas por perfil', () => {
    const { result } = setup();
    act(() => result.current.profile.selectProfile('p-1'));
    act(() => result.current.list.toggle('t-010'));
    act(() => result.current.profile.selectProfile('p-2'));
    expect(result.current.list.ids).toEqual([]);
    act(() => result.current.list.toggle('t-020'));
    act(() => result.current.profile.selectProfile('p-1'));
    expect(result.current.list.ids).toEqual(['t-010']);
    expect(JSON.parse(localStorage.getItem('nbc:my-list:p-2') ?? '[]')).toEqual(['t-020']);
  });

  it('JSON corrupto devuelve []', () => {
    localStorage.setItem('nbc:my-list:anon', '{roto');
    expect(setup().result.current.list.ids).toEqual([]);
  });
});
