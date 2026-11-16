import type { Meta, StoryObj } from '@storybook/react-vite';
import { mocked } from 'storybook/test';
import { getDashboardKpis } from '../../services/dashboardService';
import { MeetingsKpi } from './MeetingsKpi';

const REQUEST_DELAY = 400;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const meta = {
  title: 'Componentes/MeetingsKpi',
  component: MeetingsKpi,
  parameters: {
    docs: {
      description: {
        component: [
          'Indicador do Dashboard com a quantidade de encontros realizados no mês atual.',
          'Compara a quantidade de encontros com o mês anterior.',
          'As Stories utilizam mocks para demonstrar os diferentes estados e variações.',
        ].join('\n'),
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '20rem', padding: '1.5rem' }}>
        <Story />
      </div>
    ),
  ],
  beforeEach: () => {
    mocked(getDashboardKpis).mockImplementation(async () => {
      await wait(REQUEST_DELAY);

      return {
        groups: {
          active: 2,
          total: 5,
        },
        meetings: {
          currentMonth: 4,
          previousMonth: 2,
        },
      };
    });
  },
} satisfies Meta<typeof MeetingsKpi>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Increase: Story = {};

export const Decrease: Story = {
  beforeEach: () => {
    mocked(getDashboardKpis).mockResolvedValue({
      groups: { active: 2, total: 5 },
      meetings: {
        currentMonth: 1,
        previousMonth: 4,
      },
    });
  },
};

export const Same: Story = {
  beforeEach: () => {
    mocked(getDashboardKpis).mockResolvedValue({
      groups: { active: 2, total: 5 },
      meetings: {
        currentMonth: 3,
        previousMonth: 3,
      },
    });
  },
};

export const NoPreviousMeetings: Story = {
  beforeEach: () => {
    mocked(getDashboardKpis).mockResolvedValue({
      groups: { active: 2, total: 5 },
      meetings: {
        currentMonth: 2,
        previousMonth: 0,
      },
    });
  },
};

export const ZeroMeetings: Story = {
  beforeEach: () => {
    mocked(getDashboardKpis).mockResolvedValue({
      groups: { active: 2, total: 5 },
      meetings: {
        currentMonth: 0,
        previousMonth: 0,
      },
    });
  },
};

export const Loading: Story = {
  beforeEach: () => {
    mocked(getDashboardKpis).mockImplementation(() => new Promise(() => {}));
  },
};

export const Error: Story = {
  beforeEach: () => {
    mocked(getDashboardKpis).mockRejectedValue(new globalThis.Error('500'));
  },
};
