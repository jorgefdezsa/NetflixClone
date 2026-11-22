import type { RouteObject } from 'react-router-dom';
import RootLayout from './RootLayout';

export const routes: RouteObject[] = [
  {
    element: <RootLayout />,
    children: [{ path: '/', element: <p>Netflix Browse Clone</p> }],
  },
];
