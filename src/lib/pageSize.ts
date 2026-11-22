export function itemsPerPage(width: number): 2 | 3 | 4 | 5 | 6 {
  if (width >= 1400) return 6;
  if (width >= 1100) return 5;
  if (width >= 800) return 4;
  if (width >= 500) return 3;
  return 2;
}
