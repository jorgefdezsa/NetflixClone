import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { titles } from '../../data/catalog';
import { useProfile } from '../../hooks/useProfile';
import { useTitleModal } from '../../hooks/useTitleModal';
import { filterByProfile } from '../../lib/filterByProfile';
import { formatDuration } from '../../lib/formatDuration';
import { similarTitles } from '../../lib/similarTitles';
import type { Title } from '../../types';
import AddToListButton from '../AddToListButton/AddToListButton';
import Modal from '../Modal/Modal';
import SafeImage from '../SafeImage/SafeImage';
import styles from './TitleModal.module.css';

type Props = { title: Title; onClose(): void };

export default function TitleModal({ title, onClose }: Props) {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { open } = useTitleModal();
  const seasons = title.seasons ?? [];
  const [seasonNumber, setSeasonNumber] = useState(seasons[0]?.number ?? 1);
  const season = seasons.find((s) => s.number === seasonNumber);
  const similar = similarTitles(title, filterByProfile(titles, profile));

  const length =
    title.type === 'series'
      ? seasons.length === 1
        ? '1 temporada'
        : `${seasons.length} temporadas`
      : formatDuration(title.durationMinutes ?? 0);

  return (
    <Modal labelledBy="title-modal-heading" onClose={onClose}>
      <div data-testid="title-modal">
        <div className={styles.header}>
          <SafeImage src={title.banner} alt="" width={850} height={383} />
          <div className={styles.headerContent}>
            <h2 id="title-modal-heading">{title.name}</h2>
            <button
              type="button"
              className={styles.play}
              onClick={() => {
                navigate('/watch/' + title.id);
                onClose();
              }}
            >
              Reproducir
            </button>
            <AddToListButton titleId={title.id} />
          </div>
          <button type="button" className={styles.close} data-testid="modal-close" aria-label="Cerrar" onClick={onClose}>
            <span aria-hidden="true">✕</span>
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.meta}>
            <span>{title.year}</span>
            <span>{title.rating}</span>
            <span>{length}</span>
          </div>
          <p>{title.synopsis}</p>
          <div className={styles.details}>
            <span>Géneros: {title.genres.join(', ')}</span>
            <span>Reparto: {title.cast.join(', ')}</span>
          </div>

          {title.type === 'series' && (
            <section aria-label="Episodios">
              <select
                data-testid="season-select"
                aria-label="Temporada"
                className={styles.seasonSelect}
                value={seasonNumber}
                onChange={(e) => setSeasonNumber(Number(e.target.value))}
              >
                {seasons.map((s) => (
                  <option key={s.number} value={s.number}>
                    Temporada {s.number}
                  </option>
                ))}
              </select>
              {season && season.episodes.length > 0 ? (
                <ol className={styles.episodes}>
                  {season.episodes.map((ep) => (
                    <li key={ep.number} data-testid="episode-item">
                      <span>{ep.number}</span>
                      <span>
                        <strong>{ep.name}</strong>
                        <br />
                        {ep.synopsis}
                      </span>
                      <span>{formatDuration(ep.durationMinutes)}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p>Sin episodios</p>
              )}
            </section>
          )}

          {similar.length > 0 && (
            <section aria-labelledby="title-modal-similar">
              <h3 id="title-modal-similar">Títulos similares</h3>
              <div className={styles.similar}>
                {similar.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className={styles.similarButton}
                    data-testid="similar-title"
                    onClick={() => open(s)}
                  >
                    <SafeImage src={s.banner} alt="" width={320} height={180} />
                    {s.name}
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </Modal>
  );
}
