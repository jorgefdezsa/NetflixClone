import Header from '../components/Header/Header';
import Hero from '../components/Hero/Hero';
import { FEATURED_ID, titles } from '../data/catalog';
import { useProfile } from '../hooks/useProfile';
import { filterByProfile } from '../lib/filterByProfile';
import type { View } from '../types';

const TITLES: Record<View, string> = {
  home: 'Inicio',
  series: 'Series',
  movies: 'Películas',
  new: 'Novedades populares',
};

export default function BrowsePage({ view }: { view: View }) {
  const { profile } = useProfile();
  const visible = filterByProfile(titles, profile);
  const featured = visible.find((t) => t.id === FEATURED_ID) ?? visible[0];

  return (
    <>
      <Header />
      <main id="main" tabIndex={-1}>
        <h1 className="sr-only">{TITLES[view]}</h1>
        {featured && <Hero title={featured} />}
      </main>
    </>
  );
}
