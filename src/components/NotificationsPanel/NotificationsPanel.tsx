import { useEffect, useRef, type RefObject } from 'react';
import { notifications } from '../../data/catalog';
import styles from './NotificationsPanel.module.css';

type Props = {
  open: boolean;
  onClose(): void;
  anchorRef: RefObject<HTMLElement | null>;
};

export default function NotificationsPanel({ open, onClose, anchorRef }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (panelRef.current?.contains(target) || anchorRef.current?.contains(target)) return;
      onClose();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onMouseDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onMouseDown);
    };
  }, [open, onClose, anchorRef]);

  if (!open) return null;

  return (
    <div
      ref={panelRef}
      role="region"
      aria-label="Notificaciones"
      data-testid="notifications-panel"
      className={styles.panel}
    >
      <ul className={styles.list}>
        {notifications.map((n) => (
          <li key={n.id} data-testid="notification-item">
            {n.text}
            <span className={styles.date}>{n.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
