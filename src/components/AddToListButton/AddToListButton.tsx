import { useMyList } from '../../hooks/useMyList';
import styles from './AddToListButton.module.css';

type Props = { titleId: string; testId?: string };

export default function AddToListButton({ titleId, testId = 'add-to-list' }: Props) {
  const { has, toggle } = useMyList();
  const saved = has(titleId);
  return (
    <button
      type="button"
      className={styles.button}
      data-testid={testId}
      aria-pressed={saved}
      aria-label={saved ? 'Quitar de Mi lista' : 'Añadir a Mi lista'}
      onClick={() => toggle(titleId)}
    >
      <span aria-hidden="true">{saved ? '✓' : '+'}</span>
    </button>
  );
}
