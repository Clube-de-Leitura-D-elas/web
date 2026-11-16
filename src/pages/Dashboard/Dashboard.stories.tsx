import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter, Route, Routes } from 'react-router';
import { expect, mocked } from 'storybook/test';
import { DefaultLayout } from '../../layouts/DefaultLayout';
import { locale } from '../../locales';
import {
  getAbsences,
  getActiveParticipants,
  getDashboardKpis,
  getRegistrations,
} from '../../services/dashboardService';
import { Dashboard } from '.';
import { ABSENCES, buildActiveParticipants, buildRegistrations } from './storyData';

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
  // os estados dos gráficos e da lista estão nas stories de NewRegistrationsChart,
  // ActiveParticipantsChart e AbsencesList
  beforeEach: () => {
    // sem esse mock os cards de KPI quebram a story inteira (o mock do Storybook devolve undefined)
    mocked(getDashboardKpis).mockResolvedValue({
      groups: { active: 4, total: 6 },
      meetings: { currentMonth: 12, previousMonth: 10 },
    });
    mocked(getAbsences).mockResolvedValue(ABSENCES);
    mocked(getRegistrations).mockImplementation(async (granularity, from) =>
      buildRegistrations(granularity, from),
    );
    mocked(getActiveParticipants).mockImplementation(async (from, to) =>
      buildActiveParticipants(from, to),
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
