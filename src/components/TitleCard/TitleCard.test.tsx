import { act, fireEvent, screen } from '@testing-library/react';
import { getTitle } from '../../data/catalog';
import { useTitleModal } from '../../hooks/useTitleModal';
import { renderWithProviders } from '../../test/renderWithProviders';
import TitleCard from './TitleCard';

const title = getTitle('t-031')!;
const original = window.matchMedia;

function CurrentTitle() {
  const { current } = useTitleModal();
  return <span data-testid="current-title">{current?.name}</span>;
}

const setup = () =>
  renderWithProviders(
    <ul>
      <TitleCard title={title} />
      <CurrentTitle />
    </ul>,
    { profileId: 'p-1' },
  );

const hover = () => {
  fireEvent.mouseEnter(screen.getByTestId('title-card'));
  act(() => {
    vi.advanceTimersByTime(400);
  });
};

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  window.matchMedia = original;
});

describe('TitleCard', () => {
  it('muestra la previsualización con 4 botones tras 400 ms', () => {
    setup();
    fireEvent.mouseEnter(screen.getByTestId('title-card'));
    expect(screen.queryByTestId('card-preview')).toBeNull();
    act(() => {
      vi.advanceTimersByTime(400);
    });
    expect(screen.getByTestId('card-preview')).toBeInTheDocument();
    for (const id of ['preview-play', 'preview-add', 'preview-like', 'preview-more']) {
      expect(screen.getByTestId(id)).toBeInTheDocument();
    }
    expect(screen.getByTestId('card-preview')).toHaveTextContent('2 temporadas');
  });

  it('Escape la cierra', () => {
    setup();
    hover();
    fireEvent.keyDown(screen.getByTestId('title-card'), { key: 'Escape' });
    expect(screen.queryByTestId('card-preview')).toBeNull();
  });

  it('mouseLeave la cierra', () => {
    setup();
    hover();
    fireEvent.mouseLeave(screen.getByTestId('title-card'));
    expect(screen.queryByTestId('card-preview')).toBeNull();
  });

  it('con (hover: none) no aparece', () => {
    window.matchMedia = ((q: string) => ({
      matches: q === '(hover: none)',
      media: q,
      addEventListener() {},
      removeEventListener() {},
      addListener() {},
      removeListener() {},
      dispatchEvent: () => false,
      onchange: null,
    })) as typeof window.matchMedia;
    setup();
    hover();
    expect(screen.queryByTestId('card-preview')).toBeNull();
  });

  it('el clic en la tarjeta abre el modal', () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: title.name }));
    expect(screen.getByTestId('current-title')).toHaveTextContent(title.name);
  });

  it('mover el foco a un botón de la previsualización no la cierra', () => {
    setup();
    fireEvent.focus(screen.getByRole('button', { name: title.name }));
    act(() => {
      vi.advanceTimersByTime(400);
    });
    fireEvent.blur(screen.getByRole('button', { name: title.name }), {
      relatedTarget: screen.getByTestId('preview-play'),
    });
    expect(screen.getByTestId('card-preview')).toBeInTheDocument();
    fireEvent.blur(screen.getByTestId('preview-play'), { relatedTarget: document.body });
    expect(screen.queryByTestId('card-preview')).toBeNull();
  });

  it('el botón Más información cierra la previsualización y abre el modal', () => {
    setup();
    hover();
    fireEvent.click(screen.getByTestId('preview-more'));
    expect(screen.queryByTestId('card-preview')).toBeNull();
    expect(screen.getByTestId('current-title')).toHaveTextContent(title.name);
  });
});
