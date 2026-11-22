import Header from '../components/Header/Header';
import TitleGrid from '../components/TitleGrid/TitleGrid';
import { getTitle } from '../data/catalog';
import { useMyList } from '../hooks/useMyList';
import { useProfile } from '../hooks/useProfile';
import { filterByProfile } from '../lib/filterByProfile';
import type { Title } from '../types';

export default function MyListPage() {
  const { ids } = useMyList();
  const { profile } = useProfile();
  const titles = filterByProfile(
    ids.map(getTitle).filter((t): t is Title => Boolean(t)),
    profile,
  );

  return (
    <>
      <Header />
      <main id="main" tabIndex={-1} style={{ paddingTop: 'var(--header-height)' }}>
        <h1>Mi lista</h1>
        {titles.length === 0 ? (
          <p data-testid="my-list-empty">Tu lista está vacía. Añade títulos con el botón +.</p>
        ) : (
          <TitleGrid titles={titles} />
        )}
      </main>
    </>
  );
}
