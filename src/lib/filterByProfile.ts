import { KIDS_RATINGS, type Profile, type Title } from '../types';

export function filterByProfile(titles: Title[], profile: Profile | null): Title[] {
  if (profile?.isKids) return titles.filter((t) => KIDS_RATINGS.includes(t.rating));
  return titles;
}
