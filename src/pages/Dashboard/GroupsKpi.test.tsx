import { screen } from '@testing-library/react';
import { locale } from '../../locales';
import { getDashboardKpis } from '../../services/dashboardService';
import { pending, renderWithProviders } from '../../test/render';
import { GroupsKpi } from './GroupsKpi';

jest.mock('../../services/dashboardService', () => ({
  getDashboardKpis: jest.fn(),
}));

const text = locale.dashboard.kpis.groups;

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

describe('GroupsKpi', () => {
  it('mostra o carregamento enquanto busca os indicadores', () => {
    jest.mocked(getDashboardKpis).mockReturnValue(pending());

    renderWithProviders(<GroupsKpi />);

    expect(screen.getByText(locale.dataState.loading)).toBeInTheDocument();
  });

  it('mostra o total de grupos cadastrados', async () => {
    renderWithProviders(<GroupsKpi />);

    expect(await screen.findByRole('region', { name: text.title })).toBeInTheDocument();

    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText(text.description)).toBeInTheDocument();
  });

  it('mostra zero quando não existem grupos cadastrados', async () => {
    jest.mocked(getDashboardKpis).mockResolvedValue({
      groups: {
        active: 0,
        total: 0,
      },
      meetings: {
        currentMonth: 0,
        previousMonth: 0,
      },
    });

    renderWithProviders(<GroupsKpi />);

    expect(await screen.findByRole('region', { name: text.title })).toBeInTheDocument();

    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('mostra o erro e refaz a busca em "Tentar novamente"', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.mocked(getDashboardKpis).mockRejectedValueOnce(new Error('403'));

    const { user } = renderWithProviders(<GroupsKpi />);

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
