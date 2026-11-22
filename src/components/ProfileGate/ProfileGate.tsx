import { useNavigate } from 'react-router-dom';
import { profiles } from '../../data/catalog';
import { useProfile } from '../../hooks/useProfile';
import SafeImage from '../SafeImage/SafeImage';
import styles from './ProfileGate.module.css';

export default function ProfileGate() {
  const { selectProfile } = useProfile();
  const navigate = useNavigate();

  return (
    <div className={styles.gate}>
      <h1 className={styles.title}>¿Quién está viendo ahora?</h1>
      <div className={styles.list}>
        {profiles.map((p) => (
          <button
            key={p.id}
            type="button"
            className={styles.card}
            data-testid="profile-card"
            onClick={() => {
              selectProfile(p.id);
              navigate('/browse');
            }}
          >
            <SafeImage src={p.avatar} alt="" width={128} height={128} />
            <span>{p.name}</span>
            {p.isKids && <span className={styles.kids}>Perfil infantil</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
