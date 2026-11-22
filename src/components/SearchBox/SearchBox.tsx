import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import styles from './SearchBox.module.css';

export default function SearchBox() {
  const [params] = useSearchParams();
  const urlQuery = params.get('q') ?? '';
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(urlQuery !== '');
  const [text, setText] = useState(urlQuery);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounced = useDebouncedValue(text, 250);

  // Cada página pinta su propia cabecera: al pasar de /browse a /search este
  // componente se vuelve a montar y recupera el foco del campo.
  useEffect(() => {
    if (urlQuery !== '') inputRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (debounced.trim() !== '') {
      if (debounced !== urlQuery || pathname !== '/search') {
        navigate('/search?q=' + encodeURIComponent(debounced), { replace: true });
      }
    } else if (pathname === '/search') {
      navigate('/browse');
    }
    // Solo reacciona a cambios del texto con retardo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  const openAndFocus = () => {
    setOpen(true);
    inputRef.current?.focus();
  };

  return (
    <div className={styles.box}>
      <button
        type="button"
        className={styles.toggle}
        data-testid="search-toggle"
        aria-label="Buscar"
        aria-expanded={open}
        onClick={openAndFocus}
      >
        <span aria-hidden="true">🔍</span>
      </button>
      <input
        ref={inputRef}
        type="search"
        data-testid="search-input"
        aria-label="Buscar títulos, géneros o actores"
        tabIndex={open ? 0 : -1}
        value={text}
        className={open ? styles.open : styles.input}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            setText('');
            setOpen(false);
          }
        }}
      />
    </div>
  );
}
