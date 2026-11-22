import { Navigate, type RouteObject } from 'react-router-dom';
import BrowsePage from '../pages/BrowsePage';
import MyListPage from '../pages/MyListPage';
import SearchPage from '../pages/SearchPage';
import RootLayout from './RootLayout';

export const routes: RouteObject[] = [
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <Navigate to="/browse" replace /> },
      { path: '/browse', element: <BrowsePage view="home" /> },
      { path: '/browse/series', element: <BrowsePage view="series" /> },
      { path: '/browse/movies', element: <BrowsePage view="movies" /> },
      { path: '/browse/new', element: <BrowsePage view="new" /> },
      { path: '/my-list', element: <MyListPage /> },
      { path: '/search', element: <SearchPage /> },
      { path: '*', element: <Navigate to="/browse" replace /> },
    ],
  },
];
