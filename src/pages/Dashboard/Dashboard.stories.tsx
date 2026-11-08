import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter, Route, Routes } from 'react-router';
import { expect, mocked } from 'storybook/test';
import { DefaultLayout } from '../../layouts/DefaultLayout';
import { locale } from '../../locales';
import { getRegistrations } from '../../services/dashboardService';
import { Dashboard } from '.';
import { buildRegistrations } from './storyData';

const meta = {
  title: 'Pages/Dashboard',
  component: Dashboard,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<DefaultLayout />}>
            <Route index element={<Story />} />
          </Route>
        </Routes>
      </MemoryRouter>
    ),
  ],
  // os estados do gráfico estão nas stories de NewRegistrationsChart
  beforeEach: () => {
    mocked(getRegistrations).mockImplementation(async (granularity, from) =>
      buildRegistrations(granularity, from),
    );
  },
} satisfies Meta<typeof Dashboard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('heading', { level: 1, name: locale.dashboard.title }),
    ).toBeVisible();
  },
};
