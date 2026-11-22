import { useTitleModal } from '../../hooks/useTitleModal';
import TitleModal from './TitleModal';

export default function TitleModalHost() {
  const { current, close } = useTitleModal();
  return current ? <TitleModal key={current.id} title={current} onClose={close} /> : null;
}
