import { screen } from '@testing-library/react';
import { locale } from '../../locales';
import { getDashboardKpis, getRegistrations } from '../../services/dashboardService';
import { renderWithProviders } from '../../test/render';
import { Dashboard } from '.';

jest.mock('../../services/dashboardService', () => ({
  getRegistrations: jest.fn(),
  getDashboardKpis: jest.fn(),
}));

const text = locale.dashboard;

beforeEach(() => {
  jest.mocked(getRegistrations).mockResolvedValue([
    { period: '2026-10-01', total: 14 },
    { period: '2026-11-01', total: 3 },
  ]);
  jest.mocked(getDashboardKpis).mockResolvedValue({
    groups: {
      active: 2,
      total: 5,
    },
    meetings: {
      currentMonth: 1,
      previousMonth: 2,
    },
  });
});

describe('Dashboard', () => {
  it('mostra o título e o subtítulo da página', async () => {
    renderWithProviders(<Dashboard />);

    expect(screen.getByRole('heading', { level: 1, name: text.title })).toBeInTheDocument();
    expect(screen.getByText(text.subtitle)).toBeInTheDocument();
    await screen.findByRole('group', { name: text.registrations.chartLabel.month });
  });

  it('tem a área dos indicadores e a área dos gráficos', async () => {
    renderWithProviders(<Dashboard />);

    expect(screen.getByRole('region', { name: text.kpis.label })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: text.charts.label })).toBeInTheDocument();
    await screen.findByRole('group', { name: text.registrations.chartLabel.month });
  });

  it('mostra o gráfico de novas inscrições na área dos gráficos', async () => {
    renderWithProviders(<Dashboard />);

    const charts = await screen.findByRole('region', { name: text.charts.label });
    expect(charts).toContainElement(screen.getByRole('region', { name: text.registrations.title }));
    expect(
      await screen.findByRole('group', { name: text.registrations.chartLabel.month }),
    ).toBeInTheDocument();
  });

  it('mostra o indicador de grupos e encontros na área dos indicadores', async () => {
    renderWithProviders(<Dashboard />);

    const kpis = screen.getByRole('region', { name: text.kpis.label });

    const groupsKpi = await screen.findByRole('region', {
      name: text.kpis.groups.title,
    });

    const meetingsKpi = await screen.findByRole('region', {
      name: text.kpis.meetings.title,
    });

    expect(kpis).toContainElement(groupsKpi);
    expect(kpis).toContainElement(meetingsKpi);

    expect(groupsKpi).toHaveTextContent('5');
    expect(meetingsKpi).toHaveTextContent('1');
  });
});
