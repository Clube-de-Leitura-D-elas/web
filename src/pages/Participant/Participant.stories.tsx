import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, mocked } from 'storybook/test';
import { MemoryRouter, Route, Routes } from 'react-router';
import { DefaultLayout } from '../../layouts/DefaultLayout';

import { locale } from '../../locales';
import {
  getParticipantById,
  getParticipantGroups,
  getParticipantPresence,
  updateParticipantStatus,
} from '../../services/participantService';
import type { Participant, ParticipantGroup, ParticipantPresence } from '../../types/participant';

import ParticipantDetails from '.';

const REQUEST_DELAY = 400;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const participant: Participant = {
  id: '11111111-1111-1111-1111-111111111111',
  name: 'Joseane Alves',
  email: 'joseane.alves@gmail.com',
  instagram: '@joseane_alves',
  phone: '(51) 91234-5678',
  city: 'Porto Alegre',
  zone: 'Zona Leste',
  birthDate: '1990-10-24',
  job: 'Advogada',
  active: true,
};

const groups: ParticipantGroup[] = [
  {
    id: '21111111-1111-1111-1111-111111111111',
    number: 3,
    city: 'São Paulo',
    isCoordinator: true,
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    number: 12,
    city: 'Porto Alegre',
    isCoordinator: false,
  },
  {
    id: '23333333-3333-3333-3333-333333333333',
    number: 7,
    city: 'Porto Alegre',
    isCoordinator: false,
  },
  {
    id: '24444444-4444-4444-4444-444444444444',
    number: 10,
    city: 'Canoas',
    isCoordinator: false,
  },
];

const presence: ParticipantPresence[] = [
  {
    meetingId: '31111111-1111-1111-1111-111111111111',
    date: '2026-09-10T17:30:00',
    present: true,
  },
  {
    meetingId: '32222222-2222-2222-2222-222222222222',
    date: '2026-09-08T17:30:00',
    present: true,
  },
  {
    meetingId: '33333333-3333-3333-3333-333333333333',
    date: '2026-09-03T17:30:00',
    present: false,
  },
  {
    meetingId: '34444444-4444-4444-4444-444444444444',
    date: '2026-09-01T17:30:00',
    present: true,
  },
  {
    meetingId: '35555555-5555-5555-5555-555555555555',
    date: '2026-08-27T17:30:00',
    present: false,
  },
];

const meta = {
  title: 'Pages/Participant',
  component: ParticipantDetails,

  parameters: {
    layout: 'fullscreen',
  },

  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={[`/participantes/${participant.id}`]}>
        <Routes>
          <Route element={<DefaultLayout />}>
            <Route path="/participantes/:participantId" element={<Story />} />
          </Route>
        </Routes>
      </MemoryRouter>
    ),
  ],

  beforeEach: () => {
    mocked(getParticipantById).mockImplementation(async () => {
      await wait(REQUEST_DELAY);

      return participant;
    });

    mocked(getParticipantPresence).mockImplementation(async () => {
      await wait(REQUEST_DELAY);

      return presence;
    });

    mocked(getParticipantGroups).mockImplementation(async (_participantId, page, pageSize) => {
      await wait(REQUEST_DELAY);

      const start = (page - 1) * pageSize;
      const end = start + pageSize;

      return {
        groups: groups.slice(start, end),
        total: groups.length,
      };
    });

    mocked(updateParticipantStatus).mockImplementation(async (_participantId, active) => {
      await wait(REQUEST_DELAY);

      return active;
    });
  },
} satisfies Meta<typeof ParticipantDetails>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  beforeEach: () => {
    mocked(getParticipantById).mockImplementation(() => new Promise(() => {}));

    mocked(getParticipantPresence).mockImplementation(() => new Promise(() => {}));
  },
};

export const LoadError: Story = {
  beforeEach: () => {
    mocked(getParticipantById).mockRejectedValue(new Error('Falha na requisição'));
  },
};

export const WithoutGroups: Story = {
  beforeEach: () => {
    mocked(getParticipantGroups).mockResolvedValue({
      groups: [],
      total: 0,
    });
  },
};

export const ChangeStatus: Story = {
  play: async ({ canvas, userEvent }) => {
    await canvas.findByText(participant.name);

    await userEvent.click(
      canvas.getByRole('button', {
        name: locale.participant_details.status.deactivate,
      }),
    );

    await expect(updateParticipantStatus).toHaveBeenCalledWith(participant.id, false);

    await expect(
      await canvas.findByRole('button', {
        name: locale.participant_details.status.activate,
      }),
    ).toBeInTheDocument();
  },
};
