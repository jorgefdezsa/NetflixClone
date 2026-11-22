import type { CSSProperties, KeyboardEvent } from 'react';
import { useCarousel } from '../../hooks/useCarousel';
import type { Row as RowType, Title } from '../../types';
import TitleCard from '../TitleCard/TitleCard';
import styles from './Row.module.css';

export default function Row({ row, titles }: { row: RowType; titles: Title[] }) {
  const { ref, canPrev, canNext, prev, next, perPage } = useCarousel(titles.length);

  if (titles.length === 0) return null;

  const onKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    if (e.key === 'ArrowRight') next();
    else if (e.key === 'ArrowLeft') prev();
  };

  return (
    <section data-testid="row" aria-labelledby={`${row.id}-title`} className={styles.row}>
      <h2 id={`${row.id}-title`} data-testid="row-title" className={styles.heading}>
        {row.name}
      </h2>
      <button
        type="button"
        className={`${styles.arrow} ${styles.prev}`}
        data-testid="row-prev"
        aria-label="Anterior"
        disabled={!canPrev}
        onClick={prev}
      >
        ‹
      </button>
      <button
        type="button"
        className={`${styles.arrow} ${styles.next}`}
        data-testid="row-next"
        aria-label="Siguiente"
        disabled={!canNext}
        onClick={next}
      >
        ›
      </button>
      <ul ref={ref} className={styles.list} style={{ '--per-page': perPage } as CSSProperties} onKeyDown={onKeyDown}>
        {titles.map((t, i) => (
          <TitleCard key={t.id} title={t} rank={row.kind === 'top10' ? i + 1 : undefined} />
        ))}
      </ul>
    </section>
  );
}
