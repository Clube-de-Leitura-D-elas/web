import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Skeleton } from '../Skeleton';
import { DataState } from '.';

const meta = {
  title: 'Componentes/DataState',
  component: DataState,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Estados de carregamento, vazio e erro de um bloco que busca dados (card, gráfico, lista).',
          'Sem `children`, usa o texto padrão de cada variante.',
          '',
          '### Como importar',
          '',
          '```tsx',
          "import { DataState } from '../../components/DataState';",
          '```',
          '',
          '### Como usar',
          '',
          '```tsx',
          '<DataState variant="loading" minHeight="16rem" />',
          '<DataState variant="empty">Nenhuma inscrição no período.</DataState>',
          '<DataState variant="error" onRetry={load} />',
          '```',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['loading', 'empty', 'error'],
      description: 'Qual estado mostrar.',
    },
    size: {
      control: 'inline-radio',
      options: ['md', 'sm'],
      description: "`sm` é a versão compacta, para cards de indicador. Padrão: 'md'.",
    },
    children: {
      control: 'text',
      description: 'Mensagem. Sem ela, usa o texto padrão da variante.',
    },
    minHeight: {
      control: 'text',
      description: 'Altura mínima do bloco.',
    },
  },
  args: { variant: 'empty', size: 'md' },
} satisfies Meta<typeof DataState>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Loading: Story = {
  args: { variant: 'loading', minHeight: '12rem' },
};

export const LoadingComEsqueleto: Story = {
  args: {
    variant: 'loading',
    skeleton: (
      <div style={{ display: 'grid', gap: 8, width: '100%' }}>
        <Skeleton width="60%" />
        <Skeleton width="80%" />
        <Skeleton width="40%" />
      </div>
    ),
  },
};

export const Empty: Story = {
  args: { variant: 'empty' },
};

export const EmptyComMensagem: Story = {
  args: { variant: 'empty', children: 'Nenhuma inscrição no período.' },
};

export const ErrorComRetry: Story = {
  args: { variant: 'error', onRetry: fn() },
};

export const Compacto: Story = {
  args: { variant: 'error', size: 'sm', onRetry: fn() },
};
