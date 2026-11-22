import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getTitle, titles } from '../../data/catalog';
import { useTitleModal } from '../../hooks/useTitleModal';
import { renderWithProviders } from '../../test/renderWithProviders';
import TitleModal from './TitleModal';

const movie = getTitle('t-001')!;
const series = getTitle('t-031')!;

function CurrentTitle() {
  const { current } = useTitleModal();
  return <span data-testid="current-title">{current?.name}</span>;
}

describe('TitleModal', () => {
  it('película: muestra la duración y no hay selector de temporada', () => {
    renderWithProviders(<TitleModal title={movie} onClose={() => {}} />, { profileId: 'p-1' });
    expect(screen.getByTestId('title-modal')).toHaveTextContent(movie.name);
    expect(screen.getByTestId('title-modal')).toHaveTextContent('1 h 52 min');
    expect(screen.queryByTestId('season-select')).toBeNull();
    expect(screen.queryAllByTestId('episode-item')).toHaveLength(0);
  });

  it('serie: cambiar de temporada cambia la lista de episodios', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TitleModal title={series} onClose={() => {}} />, { profileId: 'p-1' });
    expect(screen.getByTestId('season-select')).toBeInTheDocument();
    expect(screen.getAllByTestId('episode-item')).toHaveLength(3);
    expect(screen.getAllByTestId('episode-item')[0]).toHaveTextContent(series.seasons![0].episodes[0].name);
    await user.selectOptions(screen.getByTestId('season-select'), '2');
    expect(screen.getAllByTestId('episode-item')[0]).toHaveTextContent(series.seasons![1].episodes[0].name);
  });

  it('Escape y modal-close llaman a onClose', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderWithProviders(<TitleModal title={movie} onClose={onClose} />, { profileId: 'p-1' });
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
    await user.click(screen.getByTestId('modal-close'));
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('similar-title abre otro título', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <>
        <TitleModal title={movie} onClose={() => {}} />
        <CurrentTitle />
      </>,
      { profileId: 'p-1' },
    );
    const similar = screen.getAllByTestId('similar-title');
    expect(similar.length).toBeGreaterThan(0);
    await user.click(similar[0]);
    expect(screen.getByTestId('current-title')).not.toBeEmptyDOMElement();
    expect(screen.getByTestId('current-title')).not.toHaveTextContent(movie.name);
  });

  it('el perfil Infantil solo recibe similares aptos', () => {
    renderWithProviders(<TitleModal title={getTitle('t-011')!} onClose={() => {}} />, { profileId: 'p-4' });
    for (const el of screen.getAllByTestId('similar-title')) {
      expect(['TP', '7+']).toContain(titles.find((t) => t.name === el.textContent)?.rating);
    }
  });
});
