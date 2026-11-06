import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../test/render';
import { DayModal } from '.';
import type { CalendarEvent } from '../../../types/calendar';
import ptBR from '../../../locales/pt-BR.json';

const mockEvents: CalendarEvent[] = [
  {
    id: '2',
    groupId: 'group-2',
    groupName: 'Clube de Leitura',
    city: 'Porto Alegre',
    startsAt: '2026-10-15T19:00:00-03:00',
    status: 'active',
  },
  {
    id: '1',
    groupId: 'group-1',
    groupName: 'Grupo de Tecnologia',
    city: 'Canoas',
    startsAt: '2026-10-15T14:00:00-03:00',
    status: 'active',
  },
];

const renderDayModal = (events: CalendarEvent[] = mockEvents) =>
  renderWithProviders(
    <DayModal isOpen onClose={jest.fn()} date={new Date(2026, 9, 15, 12)} events={events} />,
  );

describe('DayModal', () => {
  it('exibe a data local selecionada no título do modal', () => {
    renderWithProviders(
      <DayModal isOpen onClose={jest.fn()} date={new Date(2026, 10, 5, 0)} events={[]} />,
    );

    expect(
      screen.getByRole('dialog', {
        name: '5 de novembro de 2026',
      }),
    ).toBeInTheDocument();
  });

  it('exibe os eventos com horário, grupo e cidade', () => {
    renderDayModal();

    expect(screen.getByText('14:00')).toBeInTheDocument();
    expect(screen.getByText('Grupo de Tecnologia')).toBeInTheDocument();
    expect(screen.getByText('Canoas')).toBeInTheDocument();

    expect(screen.getByText('19:00')).toBeInTheDocument();
    expect(screen.getByText('Clube de Leitura')).toBeInTheDocument();
    expect(screen.getByText('Porto Alegre')).toBeInTheDocument();
  });

  it('ordena os eventos pelo horário', () => {
    renderDayModal();

    const eventNames = screen
      .getAllByText(/Grupo de Tecnologia|Clube de Leitura/)
      .map((element) => element.textContent);

    expect(eventNames).toEqual(['Grupo de Tecnologia', 'Clube de Leitura']);
  });
  it('exibe uma mensagem quando não existem eventos', () => {
    renderDayModal([]);

    expect(screen.getByText(ptBR.calendar.emptyState)).toBeInTheDocument();
  });

  it('não exibe o footer do modal', () => {
    renderDayModal();

    expect(screen.queryByRole('button', { name: 'Cancelar' })).not.toBeInTheDocument();

    expect(screen.queryByRole('button', { name: 'Confirmar' })).not.toBeInTheDocument();
  });
});
