import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MyListProvider } from '../hooks/useMyList';
import { ProfileProvider } from '../hooks/useProfile';
import { TitleModalProvider } from '../hooks/useTitleModal';

type Options = { route?: string; profileId?: string };

export function renderWithProviders(ui: ReactElement, { route = '/browse', profileId }: Options = {}) {
  if (profileId) localStorage.setItem('nbc:profile', profileId);
  return render(
    <ProfileProvider>
      <MyListProvider>
        <TitleModalProvider>
          <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
        </TitleModalProvider>
      </MyListProvider>
    </ProfileProvider>,
  );
}
