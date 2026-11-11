import { fireEvent, screen } from '@testing-library/react';
import { locale } from '../../locales';
import { getActiveParticipants } from '../../services/dashboardService';
import { pending, renderWithProviders } from '../../test/render';
import type { ActiveParticipantsItem } from '../../types/dashboard';
import { ActiveParticipantsChart } from './ActiveParticipantsChart';
import { buildActiveParticipants } from './storyData';

jest.mock('../../services/dashboardService', () => ({
  getActiveParticipants: jest.fn(),
}));

const text = locale.dashboard.activeParticipants;

// 60 meses, de 12/2021 a 11/2026
const items: ActiveParticipantsItem[] = buildActiveParticipants('2021-12-01', '2026-11-01');

const tab = (range: keyof typeof text.ranges) =>
  screen.getByRole('tab', { name: text.ranges[range] });
const zoomIn = () => screen.getByRole('button', { name: text.zoomIn });
const zoomOut = () => screen.getByRole('button', { name: text.zoomOut });
const chart = () => screen.findByRole('group', { name: text.chartLabel });

beforeEach(() => {
  jest.mocked(getActiveParticipants).mockResolvedValue(items);
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('ActiveParticipantsChart', () => {
  describe('dados', () => {
    it('mostra o título, as abas, as lupas e o carregamento', () => {
      jest.mocked(getActiveParticipants).mockReturnValue(pending());

      renderWithProviders(<ActiveParticipantsChart />);

      expect(screen.getByRole('region', { name: text.title })).toBeInTheDocument();
      expect(screen.getAllByRole('tab')).toHaveLength(4);
      expect(tab('1y')).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByText(locale.dataState.loading)).toBeInTheDocument();
    });

    it('busca 60 meses de uma vez, a partir do dia 1, e mostra o gráfico', async () => {
      renderWithProviders(<ActiveParticipantsChart />);

      expect(await chart()).toBeInTheDocument();
      expect(getActiveParticipants).toHaveBeenCalledTimes(1);
      const [from, to] = jest.mocked(getActiveParticipants).mock.calls[0];
      expect(from).toMatch(/^\d{4}-\d{2}-01$/);
      expect(to).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      // 60 meses: o mês de `from` está 59 meses antes do mês de `to`
      const [fromYear, fromMonth] = from.split('-').map(Number);
      const [toYear, toMonth] = to.split('-').map(Number);
      expect((toYear - fromYear) * 12 + (toMonth - fromMonth)).toBe(59);
    });

    it('mostra o estado vazio quando a lista vem sem meses', async () => {
      jest.mocked(getActiveParticipants).mockResolvedValue([]);

      renderWithProviders(<ActiveParticipantsChart />);

      expect(await screen.findByText(text.empty)).toBeInTheDocument();
      expect(screen.queryByRole('group', { name: text.chartLabel })).not.toBeInTheDocument();
    });

    it('mostra o estado vazio quando todos os totais são 0', async () => {
      jest
        .mocked(getActiveParticipants)
        .mockResolvedValue(items.map((item) => ({ ...item, total: 0 })));

      renderWithProviders(<ActiveParticipantsChart />);

      expect(await screen.findByText(text.empty)).toBeInTheDocument();
    });

    it('mostra o erro e refaz a busca em "Tentar novamente"', async () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      jest.mocked(getActiveParticipants).mockRejectedValueOnce(new Error('403'));

      const { user } = renderWithProviders(<ActiveParticipantsChart />);

      expect(await screen.findByRole('alert')).toHaveTextContent(locale.dataState.error);

      await user.click(screen.getByRole('button', { name: locale.dataState.retry }));

      expect(await chart()).toBeInTheDocument();
      expect(getActiveParticipants).toHaveBeenCalledTimes(2);
    });
  });

  describe('abas', () => {
    it('trocar de aba muda o período sem refazer a busca', async () => {
      const { user } = renderWithProviders(<ActiveParticipantsChart />);
      await chart();

      await user.click(tab('6m'));
      expect(tab('6m')).toHaveAttribute('aria-selected', 'true');
      expect(tab('1y')).toHaveAttribute('aria-selected', 'false');

      await user.click(tab('5y'));
      expect(tab('5y')).toHaveAttribute('aria-selected', 'true');

      expect(screen.getByRole('group', { name: text.chartLabel })).toBeInTheDocument();
      expect(getActiveParticipants).toHaveBeenCalledTimes(1);
    });

    it('os rótulos do eixo acompanham o período escolhido', async () => {
      const { user } = renderWithProviders(<ActiveParticipantsChart />);
      await chart();

      // 1 ano = 12/25 a 11/26, com rótulo a cada 2 meses contados do mais recente (nov, set,
      // jul, mai, mar, jan); 6 meses = 06/26 a 11/26, todos os meses
      expect(screen.getByText('nov/26')).toBeInTheDocument();
      expect(screen.getByText('jan/26')).toBeInTheDocument();
      expect(screen.queryByText('dez/26')).not.toBeInTheDocument();

      await user.click(tab('6m'));

      expect(screen.queryByText('jan/26')).not.toBeInTheDocument();
      expect(screen.getByText('jun/26')).toBeInTheDocument();
      expect(screen.getByText('nov/26')).toBeInTheDocument();
    });
  });

  describe('lupas', () => {
    it('aproximar vai ao período menor e a aba ativa acompanha', async () => {
      const { user } = renderWithProviders(<ActiveParticipantsChart />);
      await chart();

      await user.click(zoomIn());

      expect(tab('6m')).toHaveAttribute('aria-selected', 'true');
    });

    it('afastar vai ao período maior e a aba ativa acompanha', async () => {
      const { user } = renderWithProviders(<ActiveParticipantsChart />);
      await chart();

      await user.click(zoomOut());

      expect(tab('2y')).toHaveAttribute('aria-selected', 'true');
    });

    it('desabilita aproximar em 6 meses e afastar em 5 anos', async () => {
      const { user } = renderWithProviders(<ActiveParticipantsChart />);
      await chart();
      expect(zoomIn()).toBeEnabled();
      expect(zoomOut()).toBeEnabled();

      await user.click(zoomIn());
      expect(zoomIn()).toBeDisabled();
      expect(zoomOut()).toBeEnabled();

      await user.click(zoomOut());
      await user.click(zoomOut());
      await user.click(zoomOut());
      expect(tab('5y')).toHaveAttribute('aria-selected', 'true');
      expect(zoomOut()).toBeDisabled();
      expect(zoomIn()).toBeEnabled();
    });

    it('o zoom não refaz a busca', async () => {
      const { user } = renderWithProviders(<ActiveParticipantsChart />);
      await chart();

      await user.click(zoomIn());
      await user.click(zoomOut());
      await user.click(zoomOut());

      expect(getActiveParticipants).toHaveBeenCalledTimes(1);
    });
  });

  describe('scroll', () => {
    it('scroll para cima aproxima e para baixo afasta', async () => {
      const dateNow = jest.spyOn(Date, 'now');
      renderWithProviders(<ActiveParticipantsChart />);
      const area = await chart();

      dateNow.mockReturnValue(1_000);
      fireEvent.wheel(area, { deltaY: -100 });
      expect(tab('6m')).toHaveAttribute('aria-selected', 'true');

      dateNow.mockReturnValue(2_000);
      fireEvent.wheel(area, { deltaY: 100 });
      expect(tab('1y')).toHaveAttribute('aria-selected', 'true');
    });

    it('bloqueia o scroll da página enquanto o zoom muda', async () => {
      jest.spyOn(Date, 'now').mockReturnValue(1_000);
      renderWithProviders(<ActiveParticipantsChart />);
      const area = await chart();

      // fireEvent devolve false quando o evento teve o preventDefault chamado
      expect(fireEvent.wheel(area, { deltaY: -100 })).toBe(false);
    });

    it('nas pontas, deixa a página rolar e não muda o período', async () => {
      const dateNow = jest.spyOn(Date, 'now');
      const { user } = renderWithProviders(<ActiveParticipantsChart />);
      const area = await chart();
      await user.click(zoomIn());
      expect(tab('6m')).toHaveAttribute('aria-selected', 'true');

      dateNow.mockReturnValue(5_000);
      expect(fireEvent.wheel(area, { deltaY: -100 })).toBe(true);

      expect(tab('6m')).toHaveAttribute('aria-selected', 'true');
    });

    it('o fim do gesto que chegou à ponta continua bloqueado, e depois a página volta a rolar', async () => {
      const dateNow = jest.spyOn(Date, 'now');
      renderWithProviders(<ActiveParticipantsChart />);
      const area = await chart();

      dateNow.mockReturnValue(1_000);
      expect(fireEvent.wheel(area, { deltaY: -100 })).toBe(false);
      expect(tab('6m')).toHaveAttribute('aria-selected', 'true');

      // mesmo gesto, já na ponta: não rola a página
      dateNow.mockReturnValue(1_100);
      expect(fireEvent.wheel(area, { deltaY: -100 })).toBe(false);

      // gesto novo, na ponta: a página rola
      dateNow.mockReturnValue(1_500);
      expect(fireEvent.wheel(area, { deltaY: -100 })).toBe(true);
    });

    it('um gesto vira um passo só: eventos seguidos são ignorados', async () => {
      const dateNow = jest.spyOn(Date, 'now');
      renderWithProviders(<ActiveParticipantsChart />);
      const area = await chart();

      dateNow.mockReturnValue(1_000);
      fireEvent.wheel(area, { deltaY: 100 });
      expect(tab('2y')).toHaveAttribute('aria-selected', 'true');

      // dentro de 250 ms: ignorado (mas a página não rola)
      dateNow.mockReturnValue(1_100);
      expect(fireEvent.wheel(area, { deltaY: 100 })).toBe(false);
      expect(tab('2y')).toHaveAttribute('aria-selected', 'true');

      dateNow.mockReturnValue(1_400);
      fireEvent.wheel(area, { deltaY: 100 });
      expect(tab('5y')).toHaveAttribute('aria-selected', 'true');
    });

    it('o scroll não refaz a busca', async () => {
      jest.spyOn(Date, 'now').mockReturnValue(1_000);
      renderWithProviders(<ActiveParticipantsChart />);
      const area = await chart();

      fireEvent.wheel(area, { deltaY: -100 });

      expect(getActiveParticipants).toHaveBeenCalledTimes(1);
    });
  });
});
