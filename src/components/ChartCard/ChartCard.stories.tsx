import type { Meta, StoryObj } from '@storybook/react-vite';
import { DataState } from '../DataState';
import { ChartCard } from '.';

const meta = {
  title: 'Componentes/ChartCard',
  component: ChartCard,
  argTypes: {
    title: {
      control: 'text',
      description: 'Título do card.',
    },
    children: {
      control: false,
      description: 'Conteúdo do card: gráfico, lista ou um estado (carregando, vazio, erro).',
    },
  },
  args: {
    title: 'Novas inscrições',
    children: 'Conteúdo do card',
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '40rem' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ChartCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  args: { children: <DataState variant="loading" minHeight="16rem" /> },
};

export const Empty: Story = {
  args: {
    children: (
      <DataState variant="empty" minHeight="16rem">
        Nenhuma inscrição no período.
      </DataState>
    ),
  },
};

export const Error: Story = {
  args: {
    children: <DataState variant="error" minHeight="16rem" onRetry={() => {}} />,
  },
};
