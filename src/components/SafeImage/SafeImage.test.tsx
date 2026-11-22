import { fireEvent, render, screen } from '@testing-library/react';
import SafeImage from './SafeImage';

describe('SafeImage', () => {
  it('pasa los atributos y usa loading="lazy" por defecto', () => {
    render(<SafeImage data-testid="img" src="/assets/posters/t-001.svg" alt="Cruce de Fuego" width={300} height={450} />);
    const img = screen.getByTestId('img');
    expect(img).toHaveAttribute('src', '/assets/posters/t-001.svg');
    expect(img).toHaveAttribute('alt', 'Cruce de Fuego');
    expect(img).toHaveAttribute('width', '300');
    expect(img).toHaveAttribute('height', '450');
    expect(img).toHaveAttribute('loading', 'lazy');
  });

  it('permite loading="eager"', () => {
    render(<SafeImage data-testid="img" src="/a.svg" alt="" width={1} height={1} loading="eager" />);
    expect(screen.getByTestId('img')).toHaveAttribute('loading', 'eager');
  });

  it('cambia a la imagen sustituta una sola vez y llama al onError recibido', () => {
    const onError = vi.fn();
    render(<SafeImage data-testid="img" src="/roto.svg" alt="" width={1} height={1} onError={onError} />);
    const img = screen.getByTestId('img') as HTMLImageElement;
    fireEvent.error(img);
    expect(img.src.endsWith('/assets/placeholder.svg')).toBe(true);
    const after = img.src;
    fireEvent.error(img);
    expect(img.src).toBe(after);
    expect(onError).toHaveBeenCalledTimes(2);
  });
});
