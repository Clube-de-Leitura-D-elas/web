import type { Granularity, RegistrationsItem } from '../../types/dashboard';

// Dados de exemplo só para as stories do Dashboard.
// total 0 no meio: os períodos vazios também aparecem no gráfico.
const MONTH_TOTALS = [14, 8, 21, 37, 29, 44, 0, 52, 60, 33, 26, 18];
const WEEK_TOTALS = [6, 9, 0, 14, 11, 17, 8, 22, 13, 5, 10, 15];

// 12 períodos a partir de `from`: o dia 1 de cada mês ou uma segunda-feira por semana
export const buildRegistrations = (
  granularity: Granularity,
  from: string,
  zeroed = false,
): RegistrationsItem[] => {
  const [year, month, day] = from.split('-').map(Number);
  const totals = granularity === 'month' ? MONTH_TOTALS : WEEK_TOTALS;

  return totals.map((total, index) => {
    const date =
      granularity === 'month'
        ? new Date(Date.UTC(year, month - 1 + index, 1))
        : new Date(Date.UTC(year, month - 1, day + index * 7));

    return { period: date.toISOString().slice(0, 10), total: zeroed ? 0 : total };
  });
};
