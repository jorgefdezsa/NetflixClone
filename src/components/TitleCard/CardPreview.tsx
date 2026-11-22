import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDuration } from '../../lib/formatDuration';
import type { Title } from '../../types';
import AddToListButton from '../AddToListButton/AddToListButton';
import SafeImage from '../SafeImage/SafeImage';
import styles from './CardPreview.module.css';

type Props = { title: Title; onOpenDetail(): void };

function lengthLabel(title: Title): string {
  if (title.type === 'series') {
    const n = title.seasons?.length ?? 0;
    return n === 1 ? '1 temporada' : `${n} temporadas`;
  }
  return formatDuration(title.durationMinutes ?? 0);
}

export default function CardPreview({ title, onOpenDetail }: Props) {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);

  return (
    <div data-testid="card-preview" role="group" aria-label={title.name} className={styles.preview}>
      <SafeImage src={title.banner} alt="" width={320} height={180} className={styles.image} />
      <div className={styles.body}>
        <div className={styles.actions}>
          <button
            type="button"
            className={`${styles.round} ${styles.play}`}
            data-testid="preview-play"
            aria-label="Reproducir"
            onClick={() => navigate('/watch/' + title.id)}
          >
            <span aria-hidden="true">▶</span>
          </button>
          <AddToListButton titleId={title.id} testId="preview-add" />
          <button
            type="button"
            className={styles.round}
            data-testid="preview-like"
            aria-label="Me gusta"
            aria-pressed={liked}
            onClick={() => setLiked((l) => !l)}
          >
            <span aria-hidden="true">👍</span>
          </button>
          <button
            type="button"
            className={styles.round}
            data-testid="preview-more"
            aria-label="Más información"
            onClick={onOpenDetail}
          >
            <span aria-hidden="true">⌄</span>
          </button>
        </div>
        <p className={styles.meta}>
          {title.rating} · {lengthLabel(title)} · {title.genres.join(' • ')}
        </p>
      </div>
    </div>
  );
}
