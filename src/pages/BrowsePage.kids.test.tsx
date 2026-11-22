import { screen } from '@testing-library/react';
import { getTitle } from '../data/catalog';
import { renderWithProviders } from '../test/renderWithProviders';
import type { View } from '../types';
import BrowsePage from './BrowsePage';

const ROUTES: Record<View, string> = {
  home: '/browse',
  series: '/browse/series',
  movies: '/browse/movies',
  new: '/browse/new',
};

const ratings = () =>
  screen.getAllByTestId('title-card').map((c) => getTitle(c.getAttribute('data-title-id') ?? '')?.rating);

describe('BrowsePage con perfil Infantil', () => {
  it('p-4 solo ve títulos TP o 7+', () => {
    renderWithProviders(<BrowsePage view="home" />, { profileId: 'p-4', route: '/browse' });
    const r = ratings();
    expect(r.length).toBeGreaterThan(0);
    for (const rating of r) expect(['TP', '7+']).toContain(rating);
  });

  it('p-1 ve también otras clasificaciones', () => {
    renderWithProviders(<BrowsePage view="home" />, { profileId: 'p-1', route: '/browse' });
    expect(ratings().some((rating) => rating !== 'TP' && rating !== '7+')).toBe(true);
  });

  it.each(['new', 'series', 'movies'] as const)('p-4 en %s tiene filas y no está vacío', (view) => {
    renderWithProviders(<BrowsePage view={view} />, { profileId: 'p-4', route: ROUTES[view] });
    expect(screen.getAllByTestId('row').length).toBeGreaterThan(0);
    expect(screen.queryByTestId('browse-empty')).toBeNull();
    for (const rating of ratings()) expect(['TP', '7+']).toContain(rating);
  });
});
