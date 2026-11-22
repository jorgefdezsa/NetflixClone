import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getTitle } from '../../data/catalog';
import { useTitleModal } from '../../hooks/useTitleModal';
import { renderWithProviders } from '../../test/renderWithProviders';
import Hero from './Hero';

const title = getTitle('t-001')!;
const original = window.matchMedia;

function CurrentTitle() {
  const { current } = useTitleModal();
  return <span data-testid="current-title">{current?.name}</span>;
}

afterEach(() => {
  window.matchMedia = original;
});

describe('Hero', () => {
  it('muestra nombre, sinopsis y etiqueta de edad', () => {
    renderWithProviders(<Hero title={title} />, { profileId: 'p-1' });
    expect(screen.getByTestId('hero')).toHaveTextContent(title.name);
    expect(screen.getByTestId('hero')).toHaveTextContent(title.synopsis);
    expect(screen.getByTestId('hero')).toHaveTextContent(title.rating);
  });

  it('tiene los botones Reproducir y Más información', () => {
    renderWithProviders(<Hero title={title} />, { profileId: 'p-1' });
    expect(screen.getByTestId('hero-play')).toBeInTheDocument();
    expect(screen.getByTestId('hero-more-info')).toBeInTheDocument();
  });

  it('con movimiento reducido no hay <video>', () => {
    window.matchMedia = ((q: string) => ({
      matches: true,
      media: q,
      addEventListener() {},
      removeEventListener() {},
      addListener() {},
      removeListener() {},
      dispatchEvent: () => false,
      onchange: null,
    })) as typeof window.matchMedia;
    const { container } = renderWithProviders(<Hero title={title} />, { profileId: 'p-1' });
    expect(container.querySelector('video')).toBeNull();
  });

  it('sin preferencia de movimiento reducido hay <video>', () => {
    const { container } = renderWithProviders(<Hero title={title} />, { profileId: 'p-1' });
    expect(container.querySelector('video')).not.toBeNull();
  });

  it('Más información abre el modal con el título', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <>
        <Hero title={title} />
        <CurrentTitle />
      </>,
      { profileId: 'p-1' },
    );
    expect(screen.getByTestId('current-title')).toBeEmptyDOMElement();
    await user.click(screen.getByTestId('hero-more-info'));
    expect(screen.getByTestId('current-title')).toHaveTextContent(title.name);
  });
});
