import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { locale } from '../../locales';
import { ZoomControls } from './ZoomControls';

const text = locale.dashboard.activeParticipants;

const meta = {
  title: 'Componentes/ZoomControls',
  component: ZoomControls,
  args: {
    zoomInLabel: text.zoomIn,
    zoomOutLabel: text.zoomOut,
    canZoomIn: true,
    canZoomOut: true,
    onZoomIn: fn(),
    onZoomOut: fn(),
  },
} satisfies Meta<typeof ZoomControls>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// zoom mais próximo: não dá para aproximar mais
export const SemAproximar: Story = {
  args: { canZoomIn: false },
};

// zoom mais afastado: não dá para afastar mais
export const SemAfastar: Story = {
  args: { canZoomOut: false },
};
