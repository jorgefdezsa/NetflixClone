import { act, fireEvent, screen } from '@testing-library/react';
import { useLocation } from 'react-router-dom';
import { renderWithProviders } from '../../test/renderWithProviders';
import SearchBox from './SearchBox';

function LocationDisplay() {
  const { pathname, search } = useLocation();
  return <span data-testid="location">{pathname + search}</span>;
}

const setup = (route = '/browse') => {
  renderWithProviders(
    <>
      <SearchBox />
      <LocationDisplay />
    </>,
    { profileId: 'p-1', route },
  );
};

const type = (value: string) => fireEvent.change(screen.getByTestId('search-input'), { target: { value } });
const wait = (ms: number) =>
  act(() => {
    vi.advanceTimersByTime(ms);
  });

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('SearchBox', () => {
  it('la lupa muestra el campo enfocado', () => {
    setup();
    expect(screen.getByTestId('search-toggle')).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(screen.getByTestId('search-toggle'));
    expect(screen.getByTestId('search-toggle')).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByTestId('search-input')).toHaveFocus();
  });

  it('escribir navega a /search?q=… tras 250 ms', () => {
    setup();
    fireEvent.click(screen.getByTestId('search-toggle'));
    type('cruce');
    expect(screen.getByTestId('location')).toHaveTextContent('/browse');
    wait(250);
    expect(screen.getByTestId('location')).toHaveTextContent('/search?q=cruce');
  });

  it('vaciar el campo vuelve a /browse', () => {
    setup();
    fireEvent.click(screen.getByTestId('search-toggle'));
    type('cruce');
    wait(250);
    type('');
    wait(250);
    expect(screen.getByTestId('location')).toHaveTextContent(/^\/browse$/);
  });

  it('Escape vacía y cierra el campo', () => {
    setup();
    fireEvent.click(screen.getByTestId('search-toggle'));
    type('ab');
    fireEvent.keyDown(screen.getByTestId('search-input'), { key: 'Escape' });
    expect(screen.getByTestId('search-input')).toHaveValue('');
    expect(screen.getByTestId('search-toggle')).toHaveAttribute('aria-expanded', 'false');
  });

  it('con q en la URL el campo arranca abierto y relleno', () => {
    setup('/search?q=faro');
    expect(screen.getByTestId('search-input')).toHaveValue('faro');
    expect(screen.getByTestId('search-toggle')).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByTestId('location')).toHaveTextContent('/search?q=faro');
  });
});
