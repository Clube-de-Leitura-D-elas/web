import { screen, within } from '@testing-library/react';
import { locale } from '../../locales';
import {
  getAbsences,
  getActiveParticipants,
  getDashboardKpis,
  getRegistrations,
} from '../../services/dashboardService';
import { renderWithProviders } from '../../test/render';
import { Dashboard } from '.';
import { ABSENCES } from './storyData';

jest.mock('../../services/dashboardService', () => ({
  getRegistrations: jest.fn(),
  getActiveParticipants: jest.fn(),
  getDashboardKpis: jest.fn(),
  getAbsences: jest.fn(),
}));

const text = locale.dashboard;

beforeEach(() => {
  jest.mocked(getRegistrations).mockResolvedValue([
    { period: '2026-10-01', total: 14 },
    { period: '2026-11-01', total: 3 },
  ]);
  jest.mocked(getActiveParticipants).mockResolvedValue([
    { period: '2026-10-01', total: 980 },
    { period: '2026-11-01', total: 984 },
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
  jest.mocked(getAbsences).mockResolvedValue(ABSENCES);
});

// espera os gráficos e a lista carregarem, para nenhuma atualização de estado sobrar depois do teste
const waitForCharts = async () => {
  await screen.findByRole('group', { name: text.registrations.chartLabel.month });
  await screen.findByRole('group', { name: text.activeParticipants.chartLabel });
  await screen.findByRole('table');
};

describe('Dashboard', () => {
  it('mostra o título e o subtítulo da página', async () => {
    renderWithProviders(<Dashboard />);

    expect(screen.getByRole('heading', { level: 1, name: text.title })).toBeInTheDocument();
    expect(screen.getByText(text.subtitle)).toBeInTheDocument();
    await waitForCharts();
  });

  it('tem a área dos indicadores e a área dos gráficos', async () => {
    renderWithProviders(<Dashboard />);

    expect(screen.getByRole('region', { name: text.kpis.label })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: text.charts.label })).toBeInTheDocument();
    await waitForCharts();
  });

  it('mostra o gráfico de novas inscrições na área dos gráficos', async () => {
    renderWithProviders(<Dashboard />);

    const charts = await screen.findByRole('region', { name: text.charts.label });
    expect(charts).toContainElement(screen.getByRole('region', { name: text.registrations.title }));
    await waitForCharts();
  });

  it('mostra o gráfico do total de participantes na área dos gráficos', async () => {
    renderWithProviders(<Dashboard />);

    const charts = await screen.findByRole('region', { name: text.charts.label });
    expect(charts).toContainElement(
      screen.getByRole('region', { name: text.activeParticipants.title }),
    );
    await waitForCharts();
  });

  it('mostra a lista de quem faltou aos 3 últimos encontros fora da área dos gráficos', async () => {
    renderWithProviders(<Dashboard />);

    const list = await screen.findByRole('region', { name: text.absences.title });
    expect(screen.getByRole('region', { name: text.charts.label })).not.toContainElement(list);
    await waitForCharts();
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
    expect(within(meetingsKpi).getByText('1', { exact: true })).toBeInTheDocument();
  });
});
