import type { ActiveParticipantsItem } from '../../types/dashboard';
import { FETCH_MONTHS, lastMonths, monthsOf, stepRange } from './activeParticipantsRange';

const buildItems = (count: number): ActiveParticipantsItem[] =>
  Array.from({ length: count }, (_, index) => ({
    period: `2021-${String(index + 1).padStart(2, '0')}-01`,
    total: index,
  }));

describe('stepRange', () => {
  it('aproximar vai para o período menor', () => {
    expect(stepRange('5y', 'in')).toBe('2y');
    expect(stepRange('2y', 'in')).toBe('1y');
    expect(stepRange('1y', 'in')).toBe('6m');
  });

  it('afastar vai para o período maior', () => {
    expect(stepRange('6m', 'out')).toBe('1y');
    expect(stepRange('1y', 'out')).toBe('2y');
    expect(stepRange('2y', 'out')).toBe('5y');
  });

  it('não passa das pontas', () => {
    expect(stepRange('6m', 'in')).toBe('6m');
    expect(stepRange('5y', 'out')).toBe('5y');
  });
});

describe('monthsOf', () => {
  it('traduz cada período em meses', () => {
    expect(monthsOf('6m')).toBe(6);
    expect(monthsOf('1y')).toBe(12);
    expect(monthsOf('2y')).toBe(24);
    expect(monthsOf('5y')).toBe(60);
  });

  it('o maior período é o que o painel busca', () => {
    expect(FETCH_MONTHS).toBe(60);
  });
});

describe('lastMonths', () => {
  it('fica com os meses mais recentes', () => {
    const result = lastMonths(buildItems(12), 6);

    expect(result).toHaveLength(6);
    expect(result[0].total).toBe(6);
    expect(result[5].total).toBe(11);
  });

  it('devolve todos quando há menos pontos que o período', () => {
    expect(lastMonths(buildItems(4), 12)).toHaveLength(4);
  });

  it('devolve lista vazia sem pontos', () => {
    expect(lastMonths([], 12)).toEqual([]);
  });
});
