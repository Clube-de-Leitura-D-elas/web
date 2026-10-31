import type { Meta, StoryObj } from '@storybook/react-vite';

import { Skeleton } from './index';

const meta = {
  title: 'Componentes/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['rectangular', 'circular'],
      description: 'Formato do Skeleton.',
    },
    width: {
      control: 'text',
      description: 'Largura do Skeleton.',
    },
    height: {
      control: 'text',
      description: 'Altura do Skeleton.',
    },
  },
  args: {
    width: '100%',
    height: '0.75rem',
    variant: 'rectangular',
  },
} satisfies Meta<typeof Skeleton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Circular: Story = {
  args: {
    width: '3rem',
    height: '3rem',
    variant: 'circular',
  },
};

export const CustomSize: Story = {
  args: {
    width: '12rem',
    height: '1.5rem',
  },
};
