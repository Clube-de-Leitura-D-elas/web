import type { Meta, StoryObj } from '@storybook/react-vite';
import { BackButton } from './index';

const meta: Meta<typeof BackButton> = {
  title: 'Componentes/BackButton',
  component: BackButton,
};

export default meta;
type Story = StoryObj<typeof BackButton>;

export const Default: Story = {};

export const ComDestino: Story = {
  args: { label: 'Voltar Para Grupos' },
};
