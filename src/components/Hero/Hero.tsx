import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useTitleModal } from '../../hooks/useTitleModal';
import type { Title } from '../../types';
import SafeImage from '../SafeImage/SafeImage';
import styles from './Hero.module.css';

export default function Hero({ title }: { title: Title }) {
  const navigate = useNavigate();
  const { open } = useTitleModal();
  const reducedMotion = useReducedMotion();
  const [videoFailed, setVideoFailed] = useState(false);

  return (
    <section data-testid="hero" aria-label="Título destacado" className={styles.hero}>
      <SafeImage src={title.banner} alt="" width={1600} height={700} loading="eager" className={styles.media} />
      {!reducedMotion && !videoFailed && (
        <video
          className={styles.media}
          src="/assets/video/sample.mp4"
          autoPlay
          muted
          loop
          playsInline
          poster={title.banner}
          onError={() => setVideoFailed(true)}
        />
      )}
      <div className={styles.overlay} />
      <div className={styles.content}>
        {title.logo ? (
          <SafeImage src={title.logo} alt={title.name} width={400} height={150} />
        ) : (
          <h2>{title.name}</h2>
        )}
        <p>{title.synopsis}</p>
        <span className={styles.badge}>{title.rating}</span>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.play}
            data-testid="hero-play"
            onClick={() => navigate('/watch/' + title.id)}
          >
            Reproducir
          </button>
          <button type="button" className={styles.more} data-testid="hero-more-info" onClick={() => open(title)}>
            Más información
          </button>
        </div>
      </div>
    </section>
  );
}
