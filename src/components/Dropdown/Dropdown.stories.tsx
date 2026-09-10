import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dropdown } from '.';

const mockOptions = [
  { label: 'Romance', value: 'romance' },
  { label: 'Fantasia', value: 'fantasia' },
  { label: 'Suspense', value: 'suspense' },
  { label: 'Não-ficção', value: 'nao-ficcao' },
];

const meta: Meta<typeof Dropdown> = {
  title: 'Componentes/Dropdown',
  component: Dropdown,
  args: {
    label: 'Gênero',
    placeholder: 'Selecione um gênero',
    helperText: 'Escolha o gênero do próximo encontro',
    options: mockOptions,
    size: 'md',
  },
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

export const Default: Story = {};

export const TamanhoGrande: Story = {
  args: {
    size: 'lg',
  },
};

export const Desabilitado: Story = {
  args: {
    disabled: true,
  },
};
export const WithError: Story = {
  args: {
    label: 'Livro favorito',
    options: [
      { label: 'Dom Casmurro', value: 'dom-casmurro' },
      { label: 'Capitães da Areia', value: 'capitaes-da-areia' },
    ],
    placeholder: 'Selecione um livro',
    isError: true,
    helperText: 'Você precisa selecionar uma opção obrigatória.',
  },
};
