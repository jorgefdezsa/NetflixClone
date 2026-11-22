import { useCallback, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useScrolled } from '../../hooks/useScrolled';
import NotificationsPanel from '../NotificationsPanel/NotificationsPanel';
import ProfileMenu from '../ProfileMenu/ProfileMenu';
import styles from './Header.module.css';

const LINKS = [
  { to: '/browse', label: 'Inicio', testId: 'nav-home', end: true },
  { to: '/browse/series', label: 'Series', testId: 'nav-series', end: false },
  { to: '/browse/movies', label: 'Películas', testId: 'nav-movies', end: false },
  { to: '/browse/new', label: 'Novedades populares', testId: 'nav-new', end: false },
  { to: '/my-list', label: 'Mi lista', testId: 'nav-my-list', end: false },
];

export default function Header() {
  const scrolled = useScrolled();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLButtonElement>(null);
  const closeNotif = useCallback(() => setNotifOpen(false), []);

  return (
    <>
      <a className="skip-link" href="#main">
        Saltar al contenido
      </a>
      <header
        data-testid="app-header"
        className={scrolled ? `${styles.header} ${styles.solid}` : styles.header}
      >
        <span className={styles.logo}>NETFLIX</span>
        <nav
          id="primary-nav"
          aria-label="Principal"
          className={menuOpen ? `${styles.nav} ${styles.open}` : styles.nav}
        >
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} data-testid={l.testId} onClick={() => setMenuOpen(false)}>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <button
          type="button"
          className={styles.menuToggle}
          data-testid="nav-menu-toggle"
          aria-label="Menú"
          aria-expanded={menuOpen}
          aria-controls="primary-nav"
          onClick={() => setMenuOpen((o) => !o)}
        >
          ☰
        </button>
        <div className={styles.right}>
          <button type="button" className={styles.iconButton} data-testid="search-toggle" aria-label="Buscar">
            🔍
          </button>
          <button
            ref={notifRef}
            type="button"
            className={styles.iconButton}
            data-testid="notifications-toggle"
            aria-label="Notificaciones"
            aria-expanded={notifOpen}
            onClick={() => setNotifOpen((o) => !o)}
          >
            🔔
          </button>
          <NotificationsPanel open={notifOpen} onClose={closeNotif} anchorRef={notifRef} />
          <ProfileMenu />
        </div>
      </header>
    </>
  );
}
