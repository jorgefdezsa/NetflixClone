import { Navigate, type RouteObject } from 'react-router-dom';
import BrowsePage from '../pages/BrowsePage';
import MyListPage from '../pages/MyListPage';
import ProfilesPage from '../pages/ProfilesPage';
import SearchPage from '../pages/SearchPage';
import HomeRedirect from './HomeRedirect';
import RequireProfile from './RequireProfile';
import RootLayout from './RootLayout';

export const routes: RouteObject[] = [
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <HomeRedirect /> },
      { path: '/profiles', element: <ProfilesPage /> },
      {
        element: <RequireProfile />,
        children: [
          { path: '/browse', element: <BrowsePage view="home" /> },
          { path: '/browse/series', element: <BrowsePage view="series" /> },
          { path: '/browse/movies', element: <BrowsePage view="movies" /> },
          { path: '/browse/new', element: <BrowsePage view="new" /> },
          { path: '/my-list', element: <MyListPage /> },
          { path: '/search', element: <SearchPage /> },
          {
            path: '/watch/:id',
            lazy: () => import('../pages/WatchPage').then((m) => ({ Component: m.default })),
          },
        ],
      },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
];
