import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { MyListProvider } from '../hooks/useMyList';
import { ProfileProvider } from '../hooks/useProfile';
import { TitleModalProvider } from '../hooks/useTitleModal';
import { routes } from './routes';

const router = createBrowserRouter(routes);

export default function App() {
  return (
    <ProfileProvider>
      <MyListProvider>
        <TitleModalProvider>
          <RouterProvider router={router} />
        </TitleModalProvider>
      </MyListProvider>
    </ProfileProvider>
  );
}
