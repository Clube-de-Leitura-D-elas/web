import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DataState } from '../DataState';
import { Tabs } from '../Tab';
import { ChartCard } from '.';

const meta = {
  title: 'Componentes/ChartCard',
  component: ChartCard,
  argTypes: {
    title: {
      control: 'text',
      description: 'Título do card.',
    },
    action: {
      control: false,
      description: 'Elementos à direita do título, como as abas de período.',
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

// Abas de período à direita do título, como no gráfico "Total de Participantes".
export const WithAction: Story = {
  render: (args) => {
    const WithActionExample = () => {
      const [period, setPeriod] = useState('1y');

      return (
        <ChartCard
          {...args}
          action={
            <Tabs
              active={period}
              onChange={setPeriod}
              showPanels={false}
              tabs={[
                { value: '6m', label: '6 meses' },
                { value: '1y', label: '1 ano' },
                { value: '2y', label: '2 anos' },
              ]}
            />
          }
        >
          <DataState variant="empty" minHeight="16rem" />
        </ChartCard>
      );
    };

    return <WithActionExample />;
  },
};
