import type { Meta, StoryObj } from '@storybook/react-vite';
import { mocked } from 'storybook/test';
import { getDashboardKpis } from '../../services/dashboardService';
import { GroupsKpi } from './GroupsKpi';

const REQUEST_DELAY = 400;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const meta = {
  title: 'Componentes/GroupsKpi',
  component: GroupsKpi,
  parameters: {
    docs: {
      description: {
        component: [
          'Indicador do Dashboard com o total de grupos de leitura cadastrados.',
          'Busca os dados sozinho em `get-dashboard-kpis-web`; as stories usam um mock.',
          'O indicador apresenta o total de grupos, incluindo os encerrados.',
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
          currentMonth: 0,
          previousMonth: 0,
        },
      };
    });
  },
} satisfies Meta<typeof GroupsKpi>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ZeroGroups: Story = {
  beforeEach: () => {
    mocked(getDashboardKpis).mockResolvedValue({
      groups: {
        active: 0,
        total: 0,
      },
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
