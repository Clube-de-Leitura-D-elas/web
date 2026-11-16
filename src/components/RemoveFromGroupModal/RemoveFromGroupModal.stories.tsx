import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { RemoveFromGroupModal } from '.';

const meta = {
  title: 'Componentes/RemoveFromGroupModal',
  component: RemoveFromGroupModal,
  parameters: {
    docs: {
      description: {
        component: [
          'Confirmação para tirar uma participante de um grupo. Quando ela é a única coordenadora,',
          'exige escolher quem assume entre as `candidates` antes de liberar o botão.',
          '',
          '```tsx',
          '<RemoveFromGroupModal isOpen personName="Ana Souza" groupLabel="Grupo 03"',
          '  isCoordinator={false} onClose={close} onConfirm={(successorId) => remove(successorId)} />',
          '```',
        ].join('\n'),
      },
    },
  },
  args: {
    isOpen: true,
    personName: 'Luana Castro',
    groupLabel: 'Grupo 03',
    isCoordinator: false,
    onClose: fn(),
    onConfirm: fn(),
  },
} satisfies Meta<typeof RemoveFromGroupModal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Membra: Story = {};

export const UnicaCoordenadora: Story = {
  args: {
    personName: 'Joseane Alves',
    isCoordinator: true,
    candidates: [
      { id: 'p1', name: 'Ana Beatriz Souza' },
      { id: 'p2', name: 'Carla Mendes' },
    ],
  },
};

export const SemCandidatas: Story = {
  args: { personName: 'Joseane Alves', isCoordinator: true, candidates: [] },
};

export const ComErro: Story = {
  args: { error: 'Não foi possível atualizar a participante. Tente novamente.' },
};
