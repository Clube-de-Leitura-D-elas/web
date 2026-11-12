import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router';
import { Breadcrumb } from '.';

const meta = {
  title: 'Componentes/Breadcrumb',
  component: Breadcrumb,
  parameters: {
    docs: {
      description: {
        component: [
          'Caminho de volta no topo das telas de detalhe. Com histórico, o link volta uma página',
          '(preserva filtros da lista); aberto direto pela URL, segue para `parentTo`.',
          '',
          '```tsx',
          '<Breadcrumb ariaLabel="Navegação estrutural" parentLabel="Grupos" parentTo="/grupos" current="Grupo 03" />',
          '```',
        ].join('\n'),
      },
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  args: {
    ariaLabel: 'Navegação estrutural',
    parentLabel: 'Grupos',
    parentTo: '/grupos',
    current: 'Grupo 03',
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ComPaginaAtual: Story = {};

export const SoOLink: Story = { args: { current: null } };
