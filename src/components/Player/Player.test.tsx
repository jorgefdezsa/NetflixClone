import { act, fireEvent, screen } from '@testing-library/react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { getTitle } from '../../data/catalog';
import { renderWithProviders } from '../../test/renderWithProviders';
import Player from './Player';

const title = getTitle('t-001')!;

function LocationDisplay() {
  const { pathname } = useLocation();
  return <span data-testid="location">{pathname}</span>;
}

// jsdom no reproduce: se simula un <video> que emite play/pause y mantiene `paused`.
let paused = true;
beforeEach(() => {
  paused = true;
  Object.defineProperty(HTMLMediaElement.prototype, 'paused', { configurable: true, get: () => paused });
  vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(function (this: HTMLMediaElement) {
    paused = false;
    this.dispatchEvent(new Event('play'));
    return Promise.resolve();
  });
  vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(function (this: HTMLMediaElement) {
    paused = true;
    this.dispatchEvent(new Event('pause'));
  });
});

afterEach(() => {
  vi.restoreAllMocks();
  delete (HTMLMediaElement.prototype as unknown as Record<string, unknown>).paused;
});

const setup = () => renderWithProviders(<Player title={title} />, { profileId: 'p-1', route: '/watch/t-001' });

describe('Player', () => {
  it('muestra el título y los 5 controles', () => {
    setup();
    expect(screen.getByTestId('player')).toHaveTextContent(title.name);
    for (const id of ['player-play', 'player-volume', 'player-progress', 'player-fullscreen', 'player-back']) {
      expect(screen.getByTestId(id)).toBeInTheDocument();
    }
  });

  it('el botón de reproducir alterna su aria-label', () => {
    setup();
    const button = screen.getByTestId('player-play');
    expect(button).toHaveAttribute('aria-label', 'Reproducir');
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-label', 'Pausar');
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-label', 'Reproducir');
  });

  it('el volumen se guarda en nbc:volume', () => {
    setup();
    fireEvent.change(screen.getByTestId('player-volume'), { target: { value: '0.5' } });
    expect(JSON.parse(localStorage.getItem('nbc:volume') ?? 'null')).toBe(0.5);
  });

  it('el volumen inicial sale de nbc:volume y por defecto es 1', () => {
    setup();
    expect(screen.getByTestId('player-volume')).toHaveValue('1');
  });

  it('un nbc:volume guardado se recupera', () => {
    localStorage.setItem('nbc:volume', JSON.stringify(0.25));
    setup();
    expect(screen.getByTestId('player-volume')).toHaveValue('0.25');
  });

  it('un nbc:volume inválido se ignora', () => {
    localStorage.setItem('nbc:volume', JSON.stringify(7));
    setup();
    expect(screen.getByTestId('player-volume')).toHaveValue('1');
  });

  it('la tecla Espacio alterna la reproducción', () => {
    setup();
    const button = screen.getByTestId('player-play');
    fireEvent.keyDown(window, { key: ' ' });
    expect(button).toHaveAttribute('aria-label', 'Pausar');
    fireEvent.keyDown(window, { key: ' ' });
    expect(button).toHaveAttribute('aria-label', 'Reproducir');
  });

  it('player-back navega atrás', () => {
    function Harness() {
      const navigate = useNavigate();
      return (
        <>
          <Routes>
            <Route path="/browse" element={<button data-testid="go" onClick={() => navigate('/watch/t-001')} />} />
            <Route path="/watch/:id" element={<Player title={title} />} />
          </Routes>
          <LocationDisplay />
        </>
      );
    }
    renderWithProviders(<Harness />, { profileId: 'p-1', route: '/browse' });
    fireEvent.click(screen.getByTestId('go'));
    expect(screen.getByTestId('location')).toHaveTextContent('/watch/t-001');
    fireEvent.click(screen.getByTestId('player-back'));
    expect(screen.getByTestId('location')).toHaveTextContent('/browse');
  });

  it('el progreso sigue timeupdate', () => {
    setup();
    const video = document.querySelector('video')!;
    Object.defineProperty(video, 'duration', { configurable: true, value: 100 });
    act(() => {
      video.dispatchEvent(new Event('loadedmetadata'));
    });
    expect(screen.getByTestId('player-progress')).toHaveAttribute('max', '100');
    Object.defineProperty(video, 'currentTime', { configurable: true, writable: true, value: 40 });
    act(() => {
      video.dispatchEvent(new Event('timeupdate'));
    });
    expect(screen.getByTestId('player-progress')).toHaveValue('40');
  });
});
