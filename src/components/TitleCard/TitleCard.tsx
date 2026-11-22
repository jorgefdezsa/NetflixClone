import { useTitleModal } from '../../hooks/useTitleModal';
import type { Title } from '../../types';
import SafeImage from '../SafeImage/SafeImage';
import styles from './TitleCard.module.css';

export default function TitleCard({ title, rank }: { title: Title; rank?: number }) {
  const { open } = useTitleModal();
  return (
    <li data-testid="title-card" data-title-id={title.id} className={styles.card}>
      <button type="button" className={styles.button} aria-label={title.name} onClick={() => open(title)}>
        {rank === undefined ? (
          <SafeImage src={title.banner} alt="" width={320} height={180} className={styles.thumb} />
        ) : (
          <>
            <SafeImage src={title.poster} alt="" width={200} height={300} className={styles.poster} />
            <span data-testid="top10-rank" aria-hidden="true" className={styles.rank}>
              {rank}
            </span>
          </>
        )}
      </button>
    </li>
  );
}
