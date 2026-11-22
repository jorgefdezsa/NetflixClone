import type { FocusEvent } from 'react';
import { useHoverPreview } from '../../hooks/useHoverPreview';
import { useTitleModal } from '../../hooks/useTitleModal';
import type { Title } from '../../types';
import SafeImage from '../SafeImage/SafeImage';
import CardPreview from './CardPreview';
import styles from './TitleCard.module.css';

export default function TitleCard({ title, rank }: { title: Title; rank?: number }) {
  const { open: openModal } = useTitleModal();
  const { open: previewOpen, handlers, close } = useHoverPreview();

  // El foco que se mueve dentro de la propia tarjeta (a los botones de la
  // previsualización) no debe cerrarla.
  const onBlur = (e: FocusEvent<HTMLLIElement>) => {
    if (e.relatedTarget instanceof Node && e.currentTarget.contains(e.relatedTarget)) return;
    handlers.onBlur();
  };

  return (
    <li
      data-testid="title-card"
      data-title-id={title.id}
      className={styles.card}
      onMouseEnter={handlers.onMouseEnter}
      onMouseLeave={handlers.onMouseLeave}
      onFocus={handlers.onFocus}
      onBlur={onBlur}
      onKeyDown={handlers.onKeyDown}
    >
      <button type="button" className={styles.button} aria-label={title.name} onClick={() => openModal(title)}>
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
      {previewOpen && rank === undefined && (
        <CardPreview
          title={title}
          onOpenDetail={() => {
            close();
            openModal(title);
          }}
        />
      )}
    </li>
  );
}
