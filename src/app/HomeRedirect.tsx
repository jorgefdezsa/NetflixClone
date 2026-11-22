import { Navigate } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';

export default function HomeRedirect() {
  const { profile } = useProfile();
  return <Navigate to={profile ? '/browse' : '/profiles'} replace />;
}
