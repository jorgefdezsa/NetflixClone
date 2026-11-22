import { KIDS_RATINGS } from '../types';
import { FEATURED_ID, getTitle, notifications, profiles, rows, titles } from './catalog';

describe('catálogo', () => {
  it('tiene 60 títulos con ids únicos t-001…t-060', () => {
    expect(titles).toHaveLength(60);
    expect(new Set(titles.map((t) => t.id)).size).toBe(60);
    titles.forEach((t, i) => expect(t.id).toBe(`t-${String(i + 1).padStart(3, '0')}`));
  });

  it('todos los titleIds de las filas existen', () => {
    for (const row of rows) for (const id of row.titleIds) expect(getTitle(id), `${row.id} → ${id}`).toBeDefined();
  });

  it('r-top10 tiene 10 ids y el resto de filas al menos 6', () => {
    expect(rows).toHaveLength(11);
    for (const row of rows) {
      if (row.id === 'r-top10') expect(row.titleIds).toHaveLength(10);
      else expect(row.titleIds.length).toBeGreaterThanOrEqual(6);
    }
  });

  it('las películas tienen duración y las series temporadas', () => {
    for (const t of titles) {
      if (t.type === 'movie') expect(t.durationMinutes).toBeGreaterThan(0);
      else expect(t.seasons?.length).toBeGreaterThan(0);
    }
  });

  it('hay al menos 20 títulos aptos para Infantil', () => {
    expect(titles.filter((t) => KIDS_RATINGS.includes(t.rating)).length).toBeGreaterThanOrEqual(20);
  });

  it('tiene 4 perfiles con un único perfil infantil', () => {
    expect(profiles).toHaveLength(4);
    expect(profiles.filter((p) => p.isKids)).toHaveLength(1);
  });

  it('tiene 3 notificaciones', () => {
    expect(notifications).toHaveLength(3);
  });

  it('getTitle encuentra el destacado y devuelve undefined si no existe', () => {
    expect(getTitle(FEATURED_ID)?.name).toBe('Cruce de Fuego');
    expect(getTitle('t-999')).toBeUndefined();
  });
});
