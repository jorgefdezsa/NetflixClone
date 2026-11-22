import Header from '../components/Header/Header';
import type { View } from '../types';

const TITLES: Record<View, string> = {
  home: 'Inicio',
  series: 'Series',
  movies: 'Películas',
  new: 'Novedades populares',
};

export default function BrowsePage({ view }: { view: View }) {
  return (
    <>
      <Header />
      <main id="main" tabIndex={-1}>
        <h1 className="sr-only">{TITLES[view]}</h1>
      </main>
    </>
  );
}
