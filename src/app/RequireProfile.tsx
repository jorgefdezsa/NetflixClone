import { Navigate, Outlet } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';

export default function RequireProfile() {
  const { profile } = useProfile();
  return profile ? <Outlet /> : <Navigate to="/profiles" replace />;
}
