import type { Title } from '../../types';
import TitleCard from '../TitleCard/TitleCard';
import styles from './TitleGrid.module.css';

export default function TitleGrid({ titles }: { titles: Title[] }) {
  return (
    <ul className={styles.grid}>
      {titles.map((t) => (
        <TitleCard key={t.id} title={t} />
      ))}
    </ul>
  );
}
