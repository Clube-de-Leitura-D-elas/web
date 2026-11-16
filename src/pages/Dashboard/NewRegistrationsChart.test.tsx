import { act, screen } from '@testing-library/react';
import { locale } from '../../locales';
import { getRegistrations } from '../../services/dashboardService';
import { pending, renderWithProviders } from '../../test/render';
import type { RegistrationsItem } from '../../types/dashboard';
import { NewRegistrationsChart } from './NewRegistrationsChart';

jest.mock('../../services/dashboardService', () => ({
  getRegistrations: jest.fn(),
}));

const text = locale.dashboard.registrations;

const monthItems: RegistrationsItem[] = [
  { period: '2026-09-01', total: 0 },
  { period: '2026-10-01', total: 14 },
  { period: '2026-11-01', total: 3 },
];

const weekItems: RegistrationsItem[] = [
  { period: '2026-10-26', total: 5 },
  { period: '2026-11-02', total: 8 },
];

const daysSinceMonday = (from: string) => new Date(`${from}T00:00:00Z`).getUTCDay();

const deferred = <T,>() => {
  let resolve: (value: T) => void = () => {};
  const promise = new Promise<T>((res) => {
    resolve = res;
  });
  return { promise, resolve };
};

beforeEach(() => {
  jest.mocked(getRegistrations).mockResolvedValue(monthItems);
});

describe('NewRegistrationsChart', () => {
  it('mostra o título, as abas e o carregamento', () => {
    jest.mocked(getRegistrations).mockReturnValue(pending());

    renderWithProviders(<NewRegistrationsChart />);

    expect(screen.getByRole('region', { name: text.title })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: text.month })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: text.week })).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByText(locale.dataState.loading)).toBeInTheDocument();
  });

  it('o conteúdo é um tabpanel rotulado pela aba ativa e controlado por ela', async () => {
    const { user } = renderWithProviders(<NewRegistrationsChart />);
    await screen.findByRole('group', { name: text.chartLabel.month });

    const panel = screen.getByRole('tabpanel', { name: text.month });
    expect(screen.getByRole('tab', { name: text.month })).toHaveAttribute(
      'aria-controls',
      panel.id,
    );

    await user.click(screen.getByRole('tab', { name: text.week }));

    expect(screen.getByRole('tabpanel', { name: text.week })).toBe(panel);
  });

  it('busca os últimos 12 meses, a partir do dia 1, e mostra o gráfico', async () => {
    renderWithProviders(<NewRegistrationsChart />);

    expect(await screen.findByRole('group', { name: text.chartLabel.month })).toBeInTheDocument();
    expect(getRegistrations).toHaveBeenCalledTimes(1);
    const [granularity, from, to] = jest.mocked(getRegistrations).mock.calls[0];
    expect(granularity).toBe('month');
    expect(from).toMatch(/^\d{4}-\d{2}-01$/);
    expect(to).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('mostra o estado vazio quando todos os períodos vêm com total 0', async () => {
    jest
      .mocked(getRegistrations)
      .mockResolvedValue(monthItems.map((item) => ({ ...item, total: 0 })));

    renderWithProviders(<NewRegistrationsChart />);

    expect(await screen.findByText(text.empty)).toBeInTheDocument();
    expect(screen.queryByRole('group', { name: text.chartLabel.month })).not.toBeInTheDocument();
  });

  it('mostra o estado vazio quando a lista vem sem períodos', async () => {
    jest.mocked(getRegistrations).mockResolvedValue([]);

    renderWithProviders(<NewRegistrationsChart />);

    expect(await screen.findByText(text.empty)).toBeInTheDocument();
  });

  it('mostra o erro e refaz a busca em "Tentar novamente"', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.mocked(getRegistrations).mockRejectedValueOnce(new Error('403'));

    const { user } = renderWithProviders(<NewRegistrationsChart />);

    expect(await screen.findByRole('alert')).toHaveTextContent(locale.dataState.error);

    await user.click(screen.getByRole('button', { name: locale.dataState.retry }));

    expect(await screen.findByRole('group', { name: text.chartLabel.month })).toBeInTheDocument();
    expect(getRegistrations).toHaveBeenCalledTimes(2);
  });

  it('troca para semana: volta a carregar e busca as últimas 12 semanas, a partir da segunda', async () => {
    const { user } = renderWithProviders(<NewRegistrationsChart />);
    await screen.findByRole('group', { name: text.chartLabel.month });
    jest.mocked(getRegistrations).mockResolvedValue(weekItems);

    await user.click(screen.getByRole('tab', { name: text.week }));

    expect(await screen.findByRole('group', { name: text.chartLabel.week })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: text.week })).toHaveAttribute('aria-selected', 'true');
    const [granularity, from] = jest.mocked(getRegistrations).mock.calls[1];
    expect(granularity).toBe('week');
    expect(daysSinceMonday(from)).toBe(1);
  });

  it('clicar na aba que já está ativa não refaz a busca nem esconde o gráfico', async () => {
    const { user } = renderWithProviders(<NewRegistrationsChart />);
    await screen.findByRole('group', { name: text.chartLabel.month });

    await user.click(screen.getByRole('tab', { name: text.month }));

    expect(screen.getByRole('group', { name: text.chartLabel.month })).toBeInTheDocument();
    expect(getRegistrations).toHaveBeenCalledTimes(1);
  });

  it('voltar para a aba anterior antes da resposta mostra o carregamento, não os dados antigos', async () => {
    const { user } = renderWithProviders(<NewRegistrationsChart />);
    await screen.findByRole('group', { name: text.chartLabel.month });

    jest.mocked(getRegistrations).mockReturnValueOnce(pending());
    await user.click(screen.getByRole('tab', { name: text.week }));
    jest.mocked(getRegistrations).mockReturnValueOnce(pending());
    await user.click(screen.getByRole('tab', { name: text.month }));

    expect(screen.getByText(locale.dataState.loading)).toBeInTheDocument();
    expect(screen.queryByRole('group', { name: text.chartLabel.month })).not.toBeInTheDocument();
  });

  it('ignora a resposta de uma aba anterior que chega atrasada', async () => {
    const month = deferred<RegistrationsItem[]>();
    jest.mocked(getRegistrations).mockReturnValueOnce(month.promise);
    const { user } = renderWithProviders(<NewRegistrationsChart />);

    jest.mocked(getRegistrations).mockResolvedValueOnce(weekItems);
    await user.click(screen.getByRole('tab', { name: text.week }));
    expect(await screen.findByRole('group', { name: text.chartLabel.week })).toBeInTheDocument();

    // a resposta do mês chega depois de a aba semana já estar mostrando os dados
    await act(async () => {
      month.resolve(monthItems);
    });

    expect(screen.getByRole('group', { name: text.chartLabel.week })).toBeInTheDocument();
    expect(screen.queryByRole('group', { name: text.chartLabel.month })).not.toBeInTheDocument();
  });
});
