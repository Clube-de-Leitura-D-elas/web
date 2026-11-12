import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Toast } from '.';

const meta = {
  title: 'Componentes/Toast',
  component: Toast,
  parameters: {
    docs: {
      description: {
        component: [
          'Confirmação curta no rodapé da tela depois de uma ação. Some sozinho após `duration`',
          'e pode ter uma ação, como "Desfazer". Remonte com outra `key` para reiniciar o tempo.',
          '',
          '```tsx',
          '<Toast onDismiss={close} actionLabel="Desfazer" onAction={undo}>',
          '  Carla agora é coordenadora',
          '</Toast>',
          '```',
        ].join('\n'),
      },
    },
  },
  args: {
    children: 'Carla agora é coordenadora',
    onDismiss: fn(),
    duration: 600000,
  },
} satisfies Meta<typeof Toast>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ComAcao: Story = {
  args: { actionLabel: 'Desfazer', onAction: fn() },
};

export const SemAcao: Story = {
  args: { children: 'Luana foi removida do grupo' },
};

export const Erro: Story = {
  args: {
    variant: 'error',
    children: 'Não foi possível atualizar a participante. Tente novamente.',
  },
};
