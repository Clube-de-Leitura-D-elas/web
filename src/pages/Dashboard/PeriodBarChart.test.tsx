import { screen, within } from '@testing-library/react';
import { renderWithProviders } from '../../test/render';
import type { PeriodDatum } from './AnchoredTooltip';
import { PeriodBarChart } from './PeriodBarChart';

const monthlyData: PeriodDatum[] = [
  { key: '2026-07', label: 'jul/2026', total: 3 },
  { key: '2026-08', label: 'ago/2026', total: 4 },
  { key: '2026-09', label: 'set/2026', total: 5 },
  { key: '2026-10', label: 'out/2026', total: 2 },
  { key: '2026-11', label: 'nov/2026', total: 7 },
];

const weeklyData: PeriodDatum[] = Array.from({ length: 12 }, (_, index) => ({
  key: `week-${index + 1}`,
  label: `${String(index + 1).padStart(2, '0')}/11`,
  total: index + 1,
}));

const renderChart = (data: PeriodDatum[]) =>
  renderWithProviders(
    <PeriodBarChart
      data={data}
      formatValue={(total) => String(total)}
      ariaLabel="Gráfico de teste"
    />,
  );

describe('PeriodBarChart', () => {
  it('mostra todos os meses, incluindo setembro', () => {
    renderChart(monthlyData);

    const chart = screen.getByRole('group', {
      name: 'Gráfico de teste',
    });

    monthlyData.forEach(({ label }) => {
      expect(within(chart).getByText(label)).toBeInTheDocument();
    });
  });

  it('mostra os rótulos de todos os períodos semanais', () => {
    renderChart(weeklyData);

    const chart = screen.getByRole('group', {
      name: 'Gráfico de teste',
    });

    weeklyData.forEach(({ label }) => {
      expect(within(chart).getByText(label)).toBeInTheDocument();
    });
  });
});
