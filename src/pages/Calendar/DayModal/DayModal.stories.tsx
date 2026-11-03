import type { Meta, StoryObj } from '@storybook/react-vite';
import { DayModal } from './index';
import type { CalendarEvent } from '../../../types/calendar';

const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    groupId: 'group-1',
    groupName: 'Clube de Leitura',
    city: 'Porto Alegre',
    startsAt: '2026-10-15T14:00:00-03:00',
    status: 'active',
  },
  {
    id: '2',
    groupId: 'group-2',
    groupName: 'Grupo de Tecnologia',
    city: 'Canoas',
    startsAt: '2026-10-15T16:30:00-03:00',
    status: 'active',
  },
  {
    id: '3',
    groupId: 'group-3',
    groupName: 'Mulheres na Programação',
    city: 'Novo Hamburgo',
    startsAt: '2026-10-15T19:00:00-03:00',
    status: 'active',
  },
];

const meta = {
  title: 'Pages/Calendar/DayModal',
  component: DayModal,
  parameters: {
    docs: {
      description: {
        component: [
          'Modal que apresenta os eventos de um dia selecionado no calendário.',
          'Exibe horário, nome do grupo e cidade.',
          'Os eventos são ordenados pelo horário de início.',
          'Quando não existem eventos, apresenta uma mensagem de estado vazio.',
          'Pode ser fechado pelo botão X, pela tecla Escape ou clicando fora do modal.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Controla se o modal está aberto.',
    },
    date: {
      control: 'date',
      description: 'Data selecionada no calendário.',
    },
    events: {
      control: false,
      description: 'Eventos pertencentes ao dia selecionado.',
    },
  },
  args: {
    isOpen: true,
    date: new Date(2026, 9, 15, 12),
    events: mockEvents,
    onClose: () => {},
  },
} satisfies Meta<typeof DayModal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithEvents: Story = {};

export const WithoutEvents: Story = {
  args: {
    events: [],
  },
};

export const ManyEvents: Story = {
  args: {
    events: [
      ...mockEvents,
      {
        id: '4',
        groupId: 'group-4',
        groupName: 'Clube de Mulheres Empreendedoras',
        city: 'Porto Alegre',
        startsAt: '2026-10-15T20:00:00-03:00',
        status: 'active',
      },
      {
        id: '5',
        groupId: 'group-5',
        groupName: 'Grupo de Estudos',
        city: 'Canoas',
        startsAt: '2026-10-15T21:00:00-03:00',
        status: 'active',
      },
    ],
  },
};
