import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { profiles } from '../../data/catalog';
import { useProfile } from '../../hooks/useProfile';
import SafeImage from '../SafeImage/SafeImage';
import styles from './ProfileMenu.module.css';

export default function ProfileMenu() {
  const { profile, selectProfile, signOut } = useProfile();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const active = profile ?? profiles[0];

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const onMouseDown = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onMouseDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onMouseDown);
    };
  }, [open]);

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <button
        type="button"
        className={styles.toggle}
        data-testid="profile-menu-toggle"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Perfil: ${active.name}`}
        onClick={() => setOpen((o) => !o)}
      >
        <SafeImage src={active.avatar} alt="" width={32} height={32} />
      </button>
      {open && (
        <div role="menu" data-testid="profile-menu" className={styles.menu}>
          {profiles.map((p) => (
            <button
              key={p.id}
              type="button"
              role="menuitem"
              className={styles.item}
              data-testid="profile-option"
              onClick={() => {
                selectProfile(p.id);
                setOpen(false);
              }}
            >
              {p.name}
            </button>
          ))}
          <button
            type="button"
            role="menuitem"
            className={styles.item}
            data-testid="sign-out"
            onClick={() => {
              signOut();
              setOpen(false);
              navigate('/profiles');
            }}
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
