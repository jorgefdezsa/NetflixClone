import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayerShortcuts } from '../../hooks/usePlayerShortcuts';
import { readJson, writeJson } from '../../lib/storage';
import type { Title } from '../../types';
import styles from './Player.module.css';

const VOLUME_KEY = 'nbc:volume';

const isVolume = (v: unknown): v is number => typeof v === 'number' && v >= 0 && v <= 1;

export default function Player({ title }: { title: Title }) {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(() => readJson(VOLUME_KEY, 1, isVolume));
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (videoRef.current) videoRef.current.volume = volume;
  }, [volume]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play();
    else video.pause();
  }, []);

  const seek = useCallback((seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    const max = Number.isFinite(video.duration) ? video.duration : Infinity;
    video.currentTime = Math.min(Math.max(video.currentTime + seconds, 0), max);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void containerRef.current?.requestFullscreen?.();
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (video) video.muted = !video.muted;
  }, []);

  const goBack = useCallback(() => navigate(-1), [navigate]);

  usePlayerShortcuts({ togglePlay, seek, toggleFullscreen, toggleMute, exit: goBack });

  return (
    <div data-testid="player" ref={containerRef} className={styles.player}>
      <video
        ref={videoRef}
        className={styles.video}
        src="/assets/video/sample.mp4"
        autoPlay
        playsInline
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onLoadedMetadata={(e) => setDuration(Number.isFinite(e.currentTarget.duration) ? e.currentTarget.duration : 0)}
        onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
      />
      <div className={styles.title}>
        <button type="button" className={styles.button} data-testid="player-back" aria-label="Volver" onClick={goBack}>
          <span aria-hidden="true">←</span>
        </button>
        <span>{title.name}</span>
      </div>
      <div className={styles.controls}>
        <button
          type="button"
          className={styles.button}
          data-testid="player-play"
          aria-label={playing ? 'Pausar' : 'Reproducir'}
          onClick={togglePlay}
        >
          <span aria-hidden="true">{playing ? '⏸' : '▶'}</span>
        </button>
        <input
          type="range"
          className={styles.progress}
          data-testid="player-progress"
          aria-label="Progreso"
          min={0}
          max={duration}
          step={0.1}
          value={Math.min(current, duration)}
          onChange={(e) => {
            const value = Number(e.target.value);
            if (videoRef.current) videoRef.current.currentTime = value;
            setCurrent(value);
          }}
        />
        <input
          type="range"
          className={styles.volume}
          data-testid="player-volume"
          aria-label="Volumen"
          min={0}
          max={1}
          step={0.05}
          value={volume}
          onChange={(e) => {
            const value = Number(e.target.value);
            setVolume(value);
            writeJson(VOLUME_KEY, value);
          }}
        />
        <button
          type="button"
          className={styles.button}
          data-testid="player-fullscreen"
          aria-label="Pantalla completa"
          onClick={toggleFullscreen}
        >
          <span aria-hidden="true">⛶</span>
        </button>
      </div>
    </div>
  );
}
