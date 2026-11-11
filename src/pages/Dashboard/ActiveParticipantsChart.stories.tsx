import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, mocked, userEvent } from 'storybook/test';
import { locale } from '../../locales';
import { getActiveParticipants } from '../../services/dashboardService';
import { ActiveParticipantsChart } from './ActiveParticipantsChart';
import { buildActiveParticipants } from './storyData';

const REQUEST_DELAY = 400;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const text = locale.dashboard.activeParticipants;

const meta = {
  title: 'Componentes/ActiveParticipantsChart',
  component: ActiveParticipantsChart,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '44rem', padding: '1.5rem' }}>
        <Story />
      </div>
    ),
  ],
  beforeEach: () => {
    mocked(getActiveParticipants).mockImplementation(async (from, to) => {
      await wait(REQUEST_DELAY);

      return buildActiveParticipants(from, to);
    });
  },
} satisfies Meta<typeof ActiveParticipantsChart>;

export default meta;

type Story = StoryObj<typeof meta>;

// período de 1 ano. Lupas, abas e scroll sobre o gráfico mudam o período
export const Default: Story = {};

// aba "6 meses": o zoom mais próximo
export const SixMonths: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(await canvas.findByRole('tab', { name: text.ranges['6m'] }));

    await expect(await canvas.findByRole('group', { name: text.chartLabel })).toBeVisible();
  },
};

// aba "5 anos": o zoom mais afastado
export const FiveYears: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(await canvas.findByRole('tab', { name: text.ranges['5y'] }));

    await expect(await canvas.findByRole('group', { name: text.chartLabel })).toBeVisible();
  },
};

export const Loading: Story = {
  beforeEach: () => {
    mocked(getActiveParticipants).mockImplementation(() => new Promise(() => {}));
  },
};

// todos os meses com total 0: estado vazio no lugar do gráfico
export const Empty: Story = {
  beforeEach: () => {
    mocked(getActiveParticipants).mockImplementation(async (from, to) =>
      buildActiveParticipants(from, to, true),
    );
  },
};

// function com erro (ex.: sem permissão): aviso com "Tentar novamente"
export const Error: Story = {
  beforeEach: () => {
    mocked(getActiveParticipants).mockRejectedValue(new globalThis.Error('500'));
  },
};
