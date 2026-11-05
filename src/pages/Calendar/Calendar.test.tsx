import { screen, waitFor, within } from '@testing-library/react';
import { locale } from '../../locales';
import { getCalendarMonth } from '../../services/calendarService';
import { pending, renderWithProviders } from '../../test/render';
import type { CalendarMonthResponse } from '../../types/calendar';
import { Calendar } from './index';

jest.mock('../../services/calendarService', () => ({
  getCalendarMonth: jest.fn(),
}));

const text = locale.calendar;
const nav = text.navigation;

const renderPage = () => renderWithProviders(<Calendar />);
const getMonthButton = () => screen.getByRole('button', { expanded: false });

const getCalendarDayLabel = (date: Date) =>
  `${locale.calendar.dayAriaLabel
    .replace('{{day}}', String(date.getDate()))
    .replace('{{month}}', new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(date))
    .replace('{{year}}', String(date.getFullYear()))}, 0 eventos`;

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

  it('mostra o carregamento enquanto busca os dados', () => {
    jest.mocked(getCalendarMonth).mockReturnValue(pending());

    renderPage();

    expect(screen.getByRole('status')).toHaveTextContent(text.loading);
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

    const monthButton = getMonthButton();

    await user.click(monthButton);

    expect(screen.getByRole('listbox', { name: nav.selectMonth })).toBeInTheDocument();

    expect(screen.getAllByRole('option')).toHaveLength(12);
  });

  it('seleciona outro mês e fecha o seletor', async () => {
    const { user } = renderPage();

    const monthButton = await screen.findByRole('button', {
      name: new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(new Date()),
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
  it('impede abrir o modal ao clicar em um dia enquanto carrega', async () => {
    jest.mocked(getCalendarMonth).mockReturnValue(pending());

    const { user } = renderPage();

    const dayCells = screen.getAllByRole('button', {
      name: /\d+ de .+ de \d{4}/,
    });

    expect(dayCells.length).toBeGreaterThan(0);

    dayCells.forEach((day) => {
      expect(day).toHaveAttribute('aria-disabled', 'true');
      expect(day).toHaveAttribute('tabindex', '-1');
    });
    await user.click(dayCells[0]);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('mostra no modal somente os eventos do dia selecionado', async () => {
    const date = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const nextDate = new Date(date.getFullYear(), date.getMonth(), 2);

    const formatDateKey = (value: Date) =>
      `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;

    const selectedEvent = {
      id: 'e1',
      groupId: 'g1',
      groupName: 'Clube do Livro',
      city: 'Porto Alegre',
      startsAt: `${formatDateKey(date)}T19:00:00`,
      status: 'confirmed',
    };

    const otherEvent = {
      id: 'e2',
      groupId: 'g2',
      groupName: 'Grupo de Tecnologia',
      city: 'São Paulo',
      startsAt: `${formatDateKey(nextDate)}T19:00:00`,
      status: 'confirmed',
    };

    jest.mocked(getCalendarMonth).mockResolvedValue({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      rangeStart: formatDateKey(date),
      rangeEnd: formatDateKey(nextDate),
      days: [
        {
          date: formatDateKey(date),
          inMonth: true,
          events: [selectedEvent],
        },
        {
          date: formatDateKey(nextDate),
          inMonth: true,
          events: [otherEvent],
        },
      ],
    });

    const { user } = renderPage();

    const dayCell = await screen.findByRole('button', {
      name: `${getCalendarDayLabel(date).replace(/, 0 eventos$/, '')}, 1 evento`,
    });

    await user.click(dayCell);

    const modal = await screen.findByRole('dialog');

    expect(within(modal).getByText('Clube do Livro')).toBeInTheDocument();
    expect(within(modal).queryByText('Grupo de Tecnologia')).not.toBeInTheDocument();
  });

  it('abre o modal ao pressionar Enter em um dia', async () => {
    const { user } = renderPage();

    const date = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    const dayCell = await screen.findByRole('button', {
      name: getCalendarDayLabel(date),
    });

    dayCell.focus();
    await user.keyboard('{Enter}');

    const modalTitle = new Intl.DateTimeFormat('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);

    expect(await screen.findByRole('dialog', { name: modalTitle })).toBeInTheDocument();
  });
});
