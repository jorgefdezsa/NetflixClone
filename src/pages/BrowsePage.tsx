import Header from '../components/Header/Header';
import Hero from '../components/Hero/Hero';
import Row from '../components/Row/Row';
import { FEATURED_ID, getTitle, rows, titles } from '../data/catalog';
import { useProfile } from '../hooks/useProfile';
import { filterByProfile } from '../lib/filterByProfile';
import { rowsForView } from '../lib/rowsForView';
import type { Title, View } from '../types';

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

  const items = rowsForView(rows, view).map((row) => ({
    row,
    titles: filterByProfile(
      row.titleIds.map(getTitle).filter((t): t is Title => Boolean(t)),
      profile,
    ),
  }));
  const withTitles = items.filter((i) => i.titles.length > 0);

  return (
    <>
      <Header />
      <main id="main" tabIndex={-1}>
        <h1 className="sr-only">{TITLES[view]}</h1>
        {featured && <Hero title={featured} />}
        {withTitles.map(({ row, titles: rowTitles }) => (
          <Row key={row.id} row={row} titles={rowTitles} />
        ))}
        {withTitles.length === 0 && <p data-testid="browse-empty">No hay contenido disponible en esta vista.</p>}
      </main>
    </>
  );
}
