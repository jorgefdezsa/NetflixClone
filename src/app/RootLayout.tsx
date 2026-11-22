import { Outlet } from 'react-router-dom';
import TitleModalHost from '../components/TitleModal/TitleModalHost';

export default function RootLayout() {
  return (
    <>
      <Outlet />
      <TitleModalHost />
    </>
  );
}
