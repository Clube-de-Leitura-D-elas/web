import type { Meta, StoryObj } from '@storybook/react-vite';
import logo from '../../assets/logo-delas.png';
import { Avatar } from '.';

const meta = {
  title: 'Componentes/Avatar',
  component: Avatar,
  parameters: {
    docs: {
      description: {
        component: [
          'Foto da pessoa ou, sem foto, as iniciais do nome no fundo da marca.',
          'É decorativo (`aria-hidden`): o nome sempre aparece ao lado, em texto.',
          '',
          '```tsx',
          '<Avatar name="Joseane Alves" />',
          '<Avatar name="Joseane Alves" photo={participant.photo} size="xl" />',
          '```',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    name: { control: 'text', description: 'Nome usado para as iniciais.' },
    photo: { control: 'text', description: 'URL da foto. Sem ela, mostra as iniciais.' },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg', 'xl'],
      description: "Tamanho. Padrão: 'md'.",
    },
  },
  args: { name: 'Joseane Alves', size: 'md' },
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Initials: Story = {};

export const SingleName: Story = { args: { name: 'Joseane' } };

export const Small: Story = { args: { size: 'sm' } };

export const Large: Story = { args: { size: 'lg' } };

export const ExtraLarge: Story = { args: { size: 'xl' } };

export const WithPhoto: Story = {
  args: { photo: logo, size: 'xl' },
};

export const BrokenPhoto: Story = {
  args: { photo: 'https://exemplo.invalid/foto.jpg', size: 'lg' },
};
