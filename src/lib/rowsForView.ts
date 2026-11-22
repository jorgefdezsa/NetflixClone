import type { Row, View } from '../types';

export function rowsForView(rows: Row[], view: View): Row[] {
  return rows.filter((r) => r.views.includes(view));
}
