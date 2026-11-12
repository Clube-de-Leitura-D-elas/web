import type { Meta, StoryObj } from '@storybook/react-vite';
import { KpiCard } from './index';

const meta = {
  title: 'Componentes/KpiCard',
  component: KpiCard,
  parameters: {
    docs: {
      description: {
        component: [
          'Card para apresentar indicadores numéricos no Dashboard.',
          'Exibe um título, um valor em destaque e uma descrição opcional.',
          '',
          '### Como importar',
          '',
          '```tsx',
          "import { KpiCard } from '../components/KpiCard';",
          '```',
          '',
          '### Como usar',
          '',
          '```tsx',
          '<KpiCard',
          '  title="Grupos de leitura"',
          '  value={45}',
          '  description="Total de grupos cadastrados"',
          '/>',
          '```',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Título do indicador.',
    },
    value: {
      control: 'text',
      description: 'Valor em destaque.',
    },
    description: {
      control: 'text',
      description: 'Descrição complementar opcional.',
    },
    icon: {
      control: false,
      description: 'Ícone opcional exibido ao lado do título.',
    },
  },
  args: {
    title: 'Grupos de leitura',
    value: 45,
    description: 'Total de grupos cadastrados',
  },
} satisfies Meta<typeof KpiCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};

export const SemDescricao: Story = {
  args: {
    description: undefined,
  },
};

export const ValorZero: Story = {
  args: {
    value: 0,
  },
};

export const ValorGrande: Story = {
  args: {
    value: 1250,
  },
};
