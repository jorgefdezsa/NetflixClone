import { Navigate, useSearchParams } from 'react-router-dom';
import Header from '../components/Header/Header';
import TitleGrid from '../components/TitleGrid/TitleGrid';
import { titles } from '../data/catalog';
import { useProfile } from '../hooks/useProfile';
import { filterByProfile } from '../lib/filterByProfile';
import { searchTitles } from '../lib/searchTitles';

export default function SearchPage() {
  const q = useSearchParams()[0].get('q') ?? '';
  const { profile } = useProfile();

  if (q.trim() === '') return <Navigate to="/browse" replace />;

  const results = searchTitles(q, filterByProfile(titles, profile));

  return (
    <>
      <Header />
      <main id="main" tabIndex={-1} style={{ paddingTop: 'var(--header-height)' }}>
        <h1 className="sr-only">Resultados de búsqueda</h1>
        {results.length === 0 ? (
          <p data-testid="search-empty">No hay resultados para «{q}».</p>
        ) : (
          <div data-testid="search-results">
            <TitleGrid titles={results} />
          </div>
        )}
      </main>
    </>
  );
}
