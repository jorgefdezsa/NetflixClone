import type { Notification, Profile, Row, Title } from '../types';
import titles01 from './titles-01.json';
import titles02 from './titles-02.json';
import titles03 from './titles-03.json';
import titles04 from './titles-04.json';
import titles05 from './titles-05.json';
import titles06 from './titles-06.json';
import rowsJson from './rows.json';
import profilesJson from './profiles.json';
import notificationsJson from './notifications.json';

export const titles: Title[] = [
  ...(titles01 as Title[]),
  ...(titles02 as Title[]),
  ...(titles03 as Title[]),
  ...(titles04 as Title[]),
  ...(titles05 as Title[]),
  ...(titles06 as Title[]),
];
export const rows: Row[] = rowsJson as Row[];
export const profiles: Profile[] = profilesJson as Profile[];
export const notifications: Notification[] = notificationsJson as Notification[];

export const FEATURED_ID = 't-001';

const byId = new Map(titles.map((t) => [t.id, t]));

export function getTitle(id: string): Title | undefined {
  return byId.get(id);
}
