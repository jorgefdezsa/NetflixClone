import { formatDuration } from './formatDuration';

describe('formatDuration', () => {
  it('horas y minutos', () => {
    expect(formatDuration(95)).toBe('1 h 35 min');
  });

  it('solo minutos', () => {
    expect(formatDuration(45)).toBe('45 min');
  });

  it('solo horas', () => {
    expect(formatDuration(120)).toBe('2 h');
  });
});
