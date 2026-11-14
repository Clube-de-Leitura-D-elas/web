import { screen } from '@testing-library/react';
import { interpolate, locale } from '../../locales';
import { getDashboardKpis } from '../../services/dashboardService';
import { pending, renderWithProviders } from '../../test/render';
import { MeetingsKpi } from './MeetingsKpi';

jest.mock('../../services/dashboardService', () => ({
  getDashboardKpis: jest.fn(),
}));

const text = locale.dashboard.kpis.meetings;

beforeEach(() => {
  jest.mocked(getDashboardKpis).mockResolvedValue({
    groups: {
      active: 2,
      total: 5,
    },
    meetings: {
      currentMonth: 2,
      previousMonth: 2,
    },
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('MeetingsKpi', () => {
  it('mostra o carregamento enquanto busca os indicadores', () => {
    jest.mocked(getDashboardKpis).mockReturnValue(pending());

    renderWithProviders(<MeetingsKpi />);

    expect(screen.getByText(locale.dataState.loading)).toBeInTheDocument();
  });

  it.each([
    {
      currentMonth: 0,
      previousMonth: 0,
      description: text.noPrevious,
      scenario: 'zero encontros nos dois meses',
    },
    {
      currentMonth: 0,
      previousMonth: 3,
      description: interpolate(text.decrease, { percentage: 100 }),
      scenario: 'zero encontros no mês atual e três no anterior',
    },
    {
      currentMonth: 2,
      previousMonth: 2,
      description: text.same,
      scenario: 'mesma quantidade nos dois meses',
    },
    {
      currentMonth: 4,
      previousMonth: 2,
      description: interpolate(text.increase, { percentage: 100 }),
      scenario: 'aumento de 100%',
    },
    {
      currentMonth: 5,
      previousMonth: 2,
      description: interpolate(text.increase, { percentage: 150 }),
      scenario: 'aumento de 150%',
    },
    {
      currentMonth: 1,
      previousMonth: 4,
      description: interpolate(text.decrease, { percentage: 75 }),
      scenario: 'redução de 75%',
    },
  ])(
    'mostra corretamente quando há $scenario',
    async ({ currentMonth, previousMonth, description }) => {
      jest.mocked(getDashboardKpis).mockResolvedValue({
        groups: {
          active: 2,
          total: 5,
        },
        meetings: {
          currentMonth,
          previousMonth,
        },
      });

      renderWithProviders(<MeetingsKpi />);

      expect(await screen.findByRole('region', { name: text.title })).toBeInTheDocument();

      expect(screen.getByText(String(currentMonth))).toBeInTheDocument();
      expect(screen.getByText(description)).toBeInTheDocument();
    },
  );

  it('mostra o erro e refaz a busca em "Tentar novamente"', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.mocked(getDashboardKpis).mockRejectedValueOnce(new Error('403'));

    const { user } = renderWithProviders(<MeetingsKpi />);

    expect(await screen.findByRole('alert')).toHaveTextContent(locale.dataState.error);

    await user.click(
      screen.getByRole('button', {
        name: locale.dataState.retry,
      }),
    );

    expect(await screen.findByRole('region', { name: text.title })).toBeInTheDocument();

    expect(getDashboardKpis).toHaveBeenCalledTimes(2);
  });
});
