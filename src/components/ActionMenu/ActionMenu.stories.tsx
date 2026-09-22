import type { Meta, StoryObj } from '@storybook/react-vite';
import { MdEdit, MdAdminPanelSettings, MdBlock } from 'react-icons/md';
import { ActionMenu } from '.';
import type { ActionItem } from './index';

const mockItems: ActionItem[] = [
  {
    label: 'Editar participante',
    icon: <MdEdit size={18} />,
    onClick: () => alert('Editar participante clicado'),
  },
  {
    label: 'Tornar Admin',
    icon: <MdAdminPanelSettings size={18} />,
    onClick: () => alert('Tornar Admin clicado'),
  },
  {
    label: 'Inativar participante',
    icon: <MdBlock size={18} />,
    variant: 'danger',
    onClick: () => alert('Inativar participante clicado'),
  },
];

const meta: Meta<typeof ActionMenu> = {
  title: 'Componentes/ActionMenu',
  component: ActionMenu,
  parameters: {
    layout: 'centered', // Centraliza o componente na tela do Storybook
  },
  decorators: [
    (Story) => (
      <div
        style={{
          minHeight: '260px',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
        }}
      >
        <Story />
      </div>
    ),
  ],
  args: {
    ariaLabel: 'Mais ações',
    items: mockItems,
  },
};

export default meta;
type Story = StoryObj<typeof ActionMenu>;

export const Default: Story = {};

export const ApenasAcoesPadrao: Story = {
  args: {
    items: mockItems.filter((item) => item.variant !== 'danger'),
  },
};

export const AcaoDestrutiva: Story = {
  args: {
    items: [
      {
        label: 'Excluir registro',
        icon: <MdBlock size={18} />,
        variant: 'danger',
        onClick: () => alert('Excluir clicado'),
      },
    ],
  },
};
