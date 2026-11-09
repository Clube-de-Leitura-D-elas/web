import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, mocked, userEvent } from 'storybook/test';
import { locale } from '../../locales';
import { getRegistrations } from '../../services/dashboardService';
import { NewRegistrationsChart } from './NewRegistrationsChart';
import { buildRegistrations } from './storyData';

const REQUEST_DELAY = 400;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const text = locale.dashboard.registrations;

const meta = {
  title: 'Componentes/NewRegistrationsChart',
  component: NewRegistrationsChart,
  parameters: {
    docs: {
      description: {
        component: [
          'Card do Dashboard com as novas inscrições por mês ou por semana (últimos 12 períodos).',
          'Busca os dados sozinho em `get-dashboard-registrations-web`; as stories usam um mock.',
          'Passe o mouse em uma coluna: o tooltip fica preso ao topo da barra.',
        ].join('\n'),
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '40rem', padding: '1.5rem' }}>
        <Story />
      </div>
    ),
  ],
  beforeEach: () => {
    mocked(getRegistrations).mockImplementation(async (granularity, from) => {
      await wait(REQUEST_DELAY);

      return buildRegistrations(granularity, from);
    });
  },
} satisfies Meta<typeof NewRegistrationsChart>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// aba "Semana": busca as últimas 12 semanas
export const Weekly: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(await canvas.findByRole('tab', { name: text.week }));

    await expect(await canvas.findByRole('group', { name: text.chartLabel.week })).toBeVisible();
  },
};

export const Loading: Story = {
  beforeEach: () => {
    mocked(getRegistrations).mockImplementation(() => new Promise(() => {}));
  },
};

// todos os períodos com total 0: estado vazio no lugar do gráfico
export const Empty: Story = {
  beforeEach: () => {
    mocked(getRegistrations).mockImplementation(async (granularity, from) =>
      buildRegistrations(granularity, from, true),
    );
  },
};

// function com erro (ex.: sem permissão): aviso com "Tentar novamente"
export const Error: Story = {
  beforeEach: () => {
    mocked(getRegistrations).mockRejectedValue(new globalThis.Error('500'));
  },
};
