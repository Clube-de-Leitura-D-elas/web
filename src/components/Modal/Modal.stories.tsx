import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Modal } from './index';

const meta = {
  title: 'Componentes/Modal',
  component: Modal,
  parameters: {
    docs: {
      description: {
        component: [
          'Diálogo para confirmações e inputs de informações curtas.',
          'Overlay escuro atrás do card, bloqueia interação com o resto da tela.',
          'Fecha ao pressionar Esc, clicar no overlay, no X ou no botão "Cancelar".',
          'Enquanto aberto, o foco fica preso dentro do modal (focus trap).',
          '',
          '### Como importar',
          '',
          '```tsx',
          "import { Modal } from '../components/Modal';",
          '```',
          '',
          '### Como usar',
          '',
          '```tsx',
          '<Modal',
          '  isOpen={isOpen}',
          '  onClose={() => setIsOpen(false)}',
          '  title="Confirmar presença"',
          '  description="Ao confirmar, você entra na lista de presença do encontro do dia 12."',
          '  onConfirm={handleConfirm}',
          '  confirmText="Confirmar"',
          '/>',
          '```',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    isOpen: { control: 'boolean', description: 'Controla se o modal está aberto.' },
    title: { control: 'text', description: 'Título do modal.' },
    description: { control: 'text', description: 'Texto de apoio abaixo do título.' },
    confirmText: { control: 'text', description: 'Texto do botão de confirmação.' },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
      description: "Variante de tamanho. Padrão: 'md'.",
    },
  },
  args: {
    isOpen: true,
    title: 'Confirmar presença',
    description:
      'Ao confirmar, você entra na lista de presença do encontro do dia 12. Você pode cancelar até 24 horas antes.',
    confirmText: 'Confirmar',
    size: 'md',
    onClose: () => {},
    onConfirm: () => {},
  },
} satisfies Meta<typeof Modal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Pequeno: Story = {
  args: { size: 'sm' },
};

export const Medio: Story = {
  args: { size: 'md' },
};

export const Grande: Story = {
  args: { size: 'lg' },
};

export const ComConteudo: Story = {
  args: {
    children: <p>Conteúdo arbitrário vai aqui — um formulário, uma lista, etc.</p>,
  },
};
export const Interativo: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div>
        <button type="button" onClick={() => setIsOpen(true)}>
          Abrir modal
        </button>
        <Modal
          {...args}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onConfirm={() => setIsOpen(false)}
        />
      </div>
    );
  },
};
