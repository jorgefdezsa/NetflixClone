import { Navigate, useParams } from 'react-router-dom';
import Player from '../components/Player/Player';
import { getTitle } from '../data/catalog';

export default function WatchPage() {
  const { id } = useParams();
  const title = getTitle(id ?? '');
  if (!title) return <Navigate to="/browse" replace />;
  return <Player title={title} />;
}
