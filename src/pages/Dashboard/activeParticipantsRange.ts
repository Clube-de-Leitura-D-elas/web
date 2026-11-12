import type { ActiveParticipantsItem } from '../../types/dashboard';

export type RangeValue = '6m' | '1y' | '2y' | '5y';

// Do menor para o maior período: é a ordem das abas e dos passos do zoom.
export const RANGE_OPTIONS: { value: RangeValue; months: number }[] = [
  { value: '6m', months: 6 },
  { value: '1y', months: 12 },
  { value: '2y', months: 24 },
  { value: '5y', months: 60 },
];

export const DEFAULT_RANGE: RangeValue = '1y';

// O painel busca o maior período uma vez e recorta os menores no navegador.
export const FETCH_MONTHS = RANGE_OPTIONS[RANGE_OPTIONS.length - 1].months;

// 'in' aproxima (período menor) e 'out' afasta (período maior); nas pontas, não muda.
export const stepRange = (current: RangeValue, direction: 'in' | 'out'): RangeValue => {
  const index = RANGE_OPTIONS.findIndex((option) => option.value === current);
  const next = RANGE_OPTIONS[direction === 'in' ? index - 1 : index + 1];

  return next ? next.value : current;
};

export const monthsOf = (range: RangeValue): number =>
  RANGE_OPTIONS.find((option) => option.value === range)?.months ?? FETCH_MONTHS;

// Os últimos `months` meses; com menos pontos que isso, devolve todos.
export const lastMonths = (items: ActiveParticipantsItem[], months: number) => items.slice(-months);
