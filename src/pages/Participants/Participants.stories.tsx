import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, mocked } from 'storybook/test';
import { MemoryRouter, Route, Routes } from 'react-router';
import { Participants } from '.';
import { DefaultLayout } from '../../layouts/DefaultLayout';
import { interpolate, locale } from '../../locales';
import { getParticipantFilterOptions } from '../../services/filterOptionsService';
import {
  approvePendingParticipant,
  getParticipantsPage,
  getPendingParticipantsPage,
  rejectPendingParticipant,
} from '../../services/participantListService';
import type { ParticipantListItem, PendingParticipantListItem } from '../../types/participantList';

const REQUEST_DELAY = 300;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const participants: ParticipantListItem[] = [
  {
    id: 'p-01',
    name: 'Ana Beatriz Souza',
    status: 'active',
    group_users: [{ id: 'gu-01' }],
    recent_attendance: ['PRESENT', 'PRESENT', 'PRESENT'],
  },
  {
    id: 'p-02',
    name: 'Carla Mendes',
    status: 'active',
    group_users: [{ id: 'gu-02' }, { id: 'gu-03' }],
    recent_attendance: ['PRESENT', 'ABSENT', 'PRESENT'],
  },
  { id: 'p-03', name: 'Daniela Rocha', status: 'inactive', group_users: [] },
  {
    id: 'p-04',
    name: 'Fernanda Lima',
    status: 'active',
    group_users: [{ id: 'gu-04' }],
    recent_attendance: ['ABSENT', 'ABSENT', 'ABSENT'],
  },
  {
    id: 'p-05',
    name: 'Joseane Alves',
    status: 'active',
    group_users: [{ id: 'gu-05' }],
    recent_attendance: ['PRESENT'],
  },
  { id: 'p-06', name: 'Luana Castro', status: 'inactive', group_users: [] },
  {
    id: 'p-07',
    name: 'Mariana Duarte',
    status: 'active',
    group_users: [{ id: 'gu-06' }, { id: 'gu-07' }, { id: 'gu-08' }],
  },
  { id: 'p-08', name: 'Patrícia Nunes', status: 'active', group_users: [{ id: 'gu-09' }] },
  { id: 'p-09', name: 'Giovana Prado', status: 'awaiting_account', group_users: [] },
];

const pendingParticipants: PendingParticipantListItem[] = [
  {
    id: 'r-01',
    name: 'Bruna Oliveira',
    city: 'Porto Alegre',
    phone_number: '(51) 99876-5432',
    instagram_user: 'bruna.le',
  },
  {
    id: 'r-02',
    name: 'Gabriela Martins',
    city: null,
    phone_number: '(51) 98765-4321',
    instagram_user: null,
  },
];

const paginate = <T extends { name: string }>(
  items: T[],
  { page, pageSize }: { page: number; pageSize: number },
  { search, order }: { search: string; order: string },
) => {
  const filtered = items
    .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) =>
      order === 'name_desc' ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name),
    );
  const start = (page - 1) * pageSize;

  return { items: filtered.slice(start, start + pageSize), total: filtered.length };
};

const meta = {
  title: 'Pages/Participants',
  component: Participants,

  parameters: {
    layout: 'fullscreen',
  },

  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/participantes']}>
        <Routes>
          <Route element={<DefaultLayout />}>
            <Route path="/participantes" element={<Story />} />
          </Route>
        </Routes>
      </MemoryRouter>
    ),
  ],

  beforeEach: () => {
    mocked(getParticipantFilterOptions).mockResolvedValue({
      cityOptions: [
        { value: '', label: locale.participants.filters.cityAll },
        { value: 'city-poa', label: 'Porto Alegre' },
        { value: 'city-canoas', label: 'Canoas' },
      ],
      groupOptions: [
        { value: '', label: locale.participants.filters.groupAll },
        { value: 'group-3', label: 'Grupo 3 - Quinta à noite' },
        { value: 'group-7', label: 'Grupo 7 - Sábado de manhã' },
      ],
      summary: { groups: 4, cities: 2, activeParticipants: 10 },
    });

    mocked(getParticipantsPage).mockImplementation(async (request, filters) => {
      await wait(REQUEST_DELAY);
      return paginate(participants, request, filters);
    });

    mocked(getPendingParticipantsPage).mockImplementation(async (request, filters) => {
      await wait(REQUEST_DELAY);
      return paginate(pendingParticipants, request, filters);
    });

    mocked(approvePendingParticipant).mockResolvedValue(undefined);
    mocked(rejectPendingParticipant).mockResolvedValue(undefined);
  },
} satisfies Meta<typeof Participants>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  beforeEach: () => {
    mocked(getParticipantsPage).mockImplementation(() => new Promise(() => {}));
  },
};

export const Empty: Story = {
  beforeEach: () => {
    mocked(getParticipantsPage).mockResolvedValue({ items: [], total: 0 });
  },
};

export const Requests: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('tab', { name: locale.participants.tabs.requests }));

    await expect(await canvas.findByText(pendingParticipants[0].name)).toBeInTheDocument();
    await expect(
      canvas.getByRole('button', { name: locale.participants.filters.cityAll }),
    ).toBeDisabled();
    await expect(
      canvas.getByRole('button', { name: locale.participants.filters.groupAll }),
    ).toBeDisabled();
  },
};

export const ApproveRequest: Story = {
  play: async ({ canvas, userEvent }) => {
    const [request] = pendingParticipants;

    await userEvent.click(canvas.getByRole('tab', { name: locale.participants.tabs.requests }));
    await canvas.findByText(request.name);

    await userEvent.click(
      canvas.getByRole('button', {
        name: interpolate(locale.participants.requests.approveAriaLabel, { name: request.name }),
      }),
    );

    await expect(approvePendingParticipant).toHaveBeenCalledWith(request.id);
  },
};
