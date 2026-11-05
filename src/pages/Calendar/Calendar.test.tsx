import { act, screen, waitFor } from '@testing-library/react';
import { locale } from '../../locales';
import { getCalendarMonth } from '../../services/calendarService';
import { renderWithProviders } from '../../test/render';
import type { CalendarMonthResponse } from '../../types/calendar';
import { getCalendarDays } from '../../utils/calendar';
import { Calendar } from './index';

jest.mock('../../services/calendarService', () => ({
  getCalendarMonth: jest.fn(),
}));

const text = locale.calendar;
const nav = text.navigation;

const renderPage = () => renderWithProviders(<Calendar />);

const emptyCalendar = {
  days: [],
} as unknown as CalendarMonthResponse;

beforeEach(() => {
  jest.mocked(getCalendarMonth).mockResolvedValue(emptyCalendar);
});

describe('Calendar', () => {
  it('mostra o título e o subtítulo', () => {
    renderPage();

    expect(screen.getByText(text.title)).toBeInTheDocument();

    expect(screen.getByText(text.subtitle)).toBeInTheDocument();
  });

  it('aplica os fundos corretos durante e após o carregamento', async () => {
    let resolveRequest!: (value: CalendarMonthResponse) => void;

    jest.mocked(getCalendarMonth).mockReturnValue(
      new Promise((resolve) => {
        resolveRequest = resolve;
      }),
    );

    const { container } = renderWithProviders(<Calendar />);

    const currentDate = new Date();
    const days = getCalendarDays(currentDate.getFullYear(), currentDate.getMonth() + 1);

    const dayCells = Array.from(container.querySelectorAll('[data-testid="calendar-day"]'));

    const insideMonth = days
      .map((day, index) => ({ day, cell: dayCells[index] }))
      .filter(({ day }) => day.getMonth() === currentDate.getMonth());

    const outsideMonth = days
      .map((day, index) => ({ day, cell: dayCells[index] }))
      .filter(({ day }) => day.getMonth() !== currentDate.getMonth());

    expect(insideMonth.length).toBeGreaterThan(0);
    expect(outsideMonth.length).toBeGreaterThan(0);

    insideMonth.forEach(({ cell }) => {
      expect(getComputedStyle(cell).backgroundColor).toBe('rgb(250, 248, 249)');
    });

    outsideMonth.forEach(({ cell }) => {
      expect(getComputedStyle(cell).backgroundColor).toBe('rgb(242, 239, 241)');
    });

    await act(async () => {
      resolveRequest(emptyCalendar);
    });

    insideMonth.forEach(({ cell }) => {
      expect(getComputedStyle(cell).backgroundColor).toBe('rgb(255, 255, 255)');
    });

    outsideMonth.forEach(({ cell }) => {
      expect(getComputedStyle(cell).backgroundColor).toBe('rgb(242, 239, 241)');
    });
  });

  it('mostra uma mensagem de erro quando o calendário não carrega', async () => {
    jest.mocked(getCalendarMonth).mockRejectedValue(new Error('Erro 500'));

    renderPage();

    expect(await screen.findByRole('alert')).toHaveTextContent(text.loadError);
  });

  it('busca os dados do mês e ano atuais', async () => {
    renderPage();

    await waitFor(() => {
      expect(getCalendarMonth).toHaveBeenCalledWith(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
      );
    });
  });

  it('avança para o próximo mês', async () => {
    const { user } = renderPage();

    await screen.findByRole('button', { name: nav.nextMonth });

    const initialCallCount = jest.mocked(getCalendarMonth).mock.calls.length;

    await user.click(screen.getByRole('button', { name: nav.nextMonth }));

    await waitFor(() => {
      expect(getCalendarMonth).toHaveBeenCalledTimes(initialCallCount + 1);
    });

    const currentDate = new Date();
    const expectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);

    expect(getCalendarMonth).toHaveBeenLastCalledWith(
      expectedDate.getFullYear(),
      expectedDate.getMonth() + 1,
    );
  });

  it('volta para o mês anterior', async () => {
    const { user } = renderPage();

    await screen.findByRole('button', { name: nav.previousMonth });

    const initialCallCount = jest.mocked(getCalendarMonth).mock.calls.length;

    await user.click(screen.getByRole('button', { name: nav.previousMonth }));

    await waitFor(() => {
      expect(getCalendarMonth).toHaveBeenCalledTimes(initialCallCount + 1);
    });

    const currentDate = new Date();
    const expectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);

    expect(getCalendarMonth).toHaveBeenLastCalledWith(
      expectedDate.getFullYear(),
      expectedDate.getMonth() + 1,
    );
  });

  it('abre o seletor e lista os meses', async () => {
    const { user } = renderPage();

    const monthButton = await screen.findByRole('button', {
      name: new RegExp(
        'janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro',
        'i',
      ),
    });

    await user.click(monthButton);

    expect(screen.getByRole('listbox', { name: nav.selectMonth })).toBeInTheDocument();

    expect(screen.getAllByRole('option')).toHaveLength(12);
  });

  it('seleciona outro mês e fecha o seletor', async () => {
    const { user } = renderPage();

    const monthButton = await screen.findByRole('button', {
      name: new RegExp(
        'janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro',
        'i',
      ),
    });

    await user.click(monthButton);

    await user.click(screen.getByRole('option', { name: 'março' }));

    await waitFor(() => {
      expect(getCalendarMonth).toHaveBeenLastCalledWith(new Date().getFullYear(), 3);
    });

    expect(screen.queryByRole('listbox', { name: nav.selectMonth })).not.toBeInTheDocument();
  });

  it('permite editar o ano', async () => {
    const { user } = renderPage();

    await user.click(await screen.findByRole('button', { name: nav.editYear }));

    const yearInput = screen.getByRole('textbox', { name: nav.year });

    expect(yearInput).toBeInTheDocument();

    await user.clear(yearInput);
    await user.type(yearInput, '2030');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(getCalendarMonth).toHaveBeenLastCalledWith(2030, new Date().getMonth() + 1);
    });
  });

  it('cancela a edição do ano com Escape', async () => {
    const { user } = renderPage();

    const currentYear = new Date().getFullYear();

    await user.click(await screen.findByRole('button', { name: nav.editYear }));

    const yearInput = screen.getByRole('textbox', { name: nav.year });

    await user.clear(yearInput);
    await user.type(yearInput, '2030');
    await user.keyboard('{Escape}');

    expect(screen.getByRole('button', { name: nav.editYear })).toHaveTextContent(
      String(currentYear),
    );
  });

  it('ignora um ano com menos de 4 dígitos', async () => {
    const { user } = renderPage();
    const currentYear = new Date().getFullYear();

    await user.click(await screen.findByRole('button', { name: nav.editYear }));
    const yearInput = screen.getByRole('textbox', { name: nav.year });
    await user.clear(yearInput);
    await user.type(yearInput, '26');
    await user.keyboard('{Enter}');

    expect(screen.getByRole('button', { name: nav.editYear })).toHaveTextContent(
      String(currentYear),
    );
    expect(getCalendarMonth).not.toHaveBeenCalledWith(26, expect.any(Number));
    expect(getCalendarMonth).not.toHaveBeenCalledWith(1926, expect.any(Number));
  });

  it('volta para o mês atual pelo botão Hoje', async () => {
    const { user } = renderPage();
    const now = new Date();

    await user.click(await screen.findByRole('button', { name: nav.nextMonth }));
    await user.click(screen.getByRole('button', { name: nav.nextMonth }));
    await user.click(screen.getByRole('button', { name: nav.today }));

    await waitFor(() => {
      expect(getCalendarMonth).toHaveBeenLastCalledWith(now.getFullYear(), now.getMonth() + 1);
    });
  });
});
