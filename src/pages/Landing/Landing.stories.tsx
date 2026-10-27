import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { MemoryRouter } from 'react-router';

import { locale } from '../../locales';

import { Landing } from '.';
import { LANDING_LINKS } from './links';

const text = locale.landing;

const meta = {
  title: 'Pages/Landing',
  component: Landing,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof Landing>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 1, name: text.hero.title })).toBeVisible();

    const primaryCta = canvas.getByRole('link', { name: new RegExp(text.hero.primaryCta) });
    await expect(primaryCta).toHaveAttribute('href', LANDING_LINKS.readingSignUp);
    await expect(primaryCta).toHaveAttribute('target', '_blank');

    const politicalCta = canvas.getByRole('link', {
      name: new RegExp(text.projects.political.cta),
    });
    await expect(politicalCta).toHaveAttribute('href', LANDING_LINKS.politicalSignUp);
  },
};

export const Mobile: Story = {
  globals: {
    viewport: { value: 'mobile1' },
  },
};
