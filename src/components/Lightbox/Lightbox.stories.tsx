import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { Lightbox, type LightboxItem } from './index';

const items: LightboxItem[] = Array.from({ length: 5 }, (_, index) => ({
  id: `photo-${index + 1}`,
  src: `https://picsum.photos/seed/lightbox-${index + 1}/1200/800`,
  alt: `Foto ${index + 1} do evento`,
}));

const meta = {
  title: 'Componentes/Lightbox',
  component: Lightbox,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Visualização ampliada de imagens, com navegação entre elas.',
          'Fecha pelo X, por `Esc` e ao clicar fora da imagem; as setas do teclado navegam.',
          'O foco fica preso dentro e volta ao elemento de origem ao fechar.',
          'O `footer` recebe informações e ações da imagem aberta (autor, data, botão de baixar).',
          '',
          '```tsx',
          '<Lightbox',
          '  items={items}',
          '  index={index}',
          '  onIndexChange={setIndex}',
          '  onClose={() => setIndex(null)}',
          '  label="Galeria"',
          '/>',
          '```',
        ].join('\n'),
      },
    },
  },
  args: {
    items,
    index: 0,
    label: 'Galeria de fotos',
    onIndexChange: () => {},
    onClose: () => {},
  },
  render: function Render(args) {
    const [index, setIndex] = useState(args.index);
    const [open, setOpen] = useState(true);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Abrir galeria</Button>
        {open && (
          <Lightbox
            {...args}
            index={index}
            onIndexChange={setIndex}
            onClose={() => setOpen(false)}
          />
        )}
      </>
    );
  },
} satisfies Meta<typeof Lightbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// primeira foto: o botão "anterior" fica desabilitado
export const FirstImage: Story = { args: { index: 0 } };

// última foto: o botão "próxima" fica desabilitado
export const LastImage: Story = { args: { index: items.length - 1 } };

export const WithFooter: Story = {
  args: {
    footer: <span>Enviada por Joseane Alves em 23/08/2026</span>,
  },
};

// imagem que não carrega: placeholder, e a navegação continua funcionando
export const BrokenImage: Story = {
  args: {
    items: [{ id: 'broken', src: '/foto-inexistente.jpg', alt: 'Foto quebrada' }, ...items],
  },
};
