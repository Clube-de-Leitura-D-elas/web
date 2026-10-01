import type { Meta, StoryObj } from '@storybook/react-vite';
import { mocked } from 'storybook/test';
import { MemoryRouter, Route, Routes } from 'react-router';
import { GroupDetails } from '.';
import { DefaultLayout } from '../../layouts/DefaultLayout';
import {
  getGroupDetails,
  getGroupMeetingsPage,
  getGroupParticipantsPage,
} from '../../services/groupService';
import type {
  GroupDetails as GroupDetailsData,
  GroupMeetingHistoryItem,
  GroupParticipantListItem,
} from '../../types/group';

const REQUEST_DELAY = 300;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const group: GroupDetailsData = {
  id: 'g-03',
  number: 3,
  description: 'Quinta à noite',
  city: 'Porto Alegre',
  is_active: true,
  active_participants_count: 8,
  coordinator_name: 'Joseane Alves',
  coordinator_email: 'joseane.alves@email.com',
  next_meeting: {
    date: '2024-08-24T22:30:00Z',
    book_title: 'A Hora da Estrela',
    book_author: 'Clarice Lispector',
    place: 'Casa da Ana',
    neighborhood: 'Menino Deus',
    confirmed: true,
  },
};

const participants: GroupParticipantListItem[] = [
  {
    id: 'p-01',
    name: 'Ana Beatriz Souza',
    entry_date: '2025-02-10',
    attendance: ['P', 'F', 'P'],
    email: 'ana@email.com',
    is_coordinator: false,
  },
  {
    id: 'p-02',
    name: 'Carla Mendes',
    entry_date: '2025-05-22',
    attendance: ['P', 'P', 'P'],
    email: 'carla@email.com',
    is_coordinator: false,
  },
  {
    id: 'p-03',
    name: 'Fernanda Lima',
    entry_date: null,
    attendance: [],
    email: null,
    is_coordinator: false,
  },
  {
    id: 'p-04',
    name: 'Joseane Alves',
    entry_date: '2024-11-03',
    attendance: ['P', 'P', 'F'],
    email: 'joseane@email.com',
    is_coordinator: true,
  },
  {
    id: 'p-05',
    name: 'Luana Castro',
    entry_date: '2025-01-15',
    attendance: ['F', 'F', 'P'],
    email: 'luana@email.com',
    is_coordinator: false,
  },
  {
    id: 'p-06',
    name: 'Mariana Duarte',
    entry_date: '2024-09-22',
    attendance: ['P', 'P', 'P'],
    email: 'mariana@email.com',
    is_coordinator: false,
  },
  {
    id: 'p-07',
    name: 'Patrícia Nunes',
    entry_date: '2025-03-08',
    attendance: ['P', 'F', 'F'],
    email: 'patricia@email.com',
    is_coordinator: false,
  },
  {
    id: 'p-08',
    name: 'Rafaela Costa',
    entry_date: '2024-07-19',
    attendance: ['P', 'P', 'F'],
    email: 'rafaela@email.com',
    is_coordinator: false,
  },
  {
    id: 'p-09',
    name: 'Simone Barros',
    entry_date: '2025-04-01',
    attendance: ['F', 'P', 'P'],
    email: 'simone@email.com',
    is_coordinator: false,
  },
  {
    id: 'p-10',
    name: 'Tatiane Ramos',
    entry_date: '2024-12-11',
    attendance: ['P', 'P', 'P'],
    email: 'tatiane@email.com',
    is_coordinator: false,
  },
];

const meetings: GroupMeetingHistoryItem[] = [
  {
    id: 'm-01',
    date: '2024-07-20',
    book_title: 'Tudo É Rio',
    book_author: 'Carla Madeira',
    place: 'Livraria da Vila',
    neighborhood: 'Pinheiros',
    attendance_present: 24,
    attendance_total: 26,
    average_rating: 4.8,
    votes_count: 22,
  },
  {
    id: 'm-02',
    date: '2024-08-15',
    book_title: 'A Resistência',
    book_author: 'Julián Fuks',
    place: 'Saraiva',
    neighborhood: 'Shopping Eldorado',
    attendance_present: 30,
    attendance_total: 30,
    average_rating: 4.9,
    votes_count: 18,
  },
  {
    id: 'm-03',
    date: '2024-05-18',
    book_title: 'O Avesso da Pele',
    book_author: 'Jeferson Tenório',
    place: 'Livraria da Vila',
    neighborhood: 'Pinheiros',
    attendance_present: 25,
    attendance_total: 26,
    average_rating: null,
    votes_count: 0,
  },
  {
    id: 'm-04',
    date: '2024-08-15',
    book_title: 'Mulheres que Correm com os Lobos',
    book_author: 'Clarissa Pinkola Estés',
    place: 'Saraiva',
    neighborhood: 'Shopping Eldorado',
    attendance_present: 15,
    attendance_total: 30,
    average_rating: 2.5,
    votes_count: 18,
  },
  {
    id: 'm-05',
    date: '2024-07-20',
    book_title: 'Quarto de Despejo',
    book_author: 'Carolina Maria de Jesus',
    place: 'Café Santo Grão',
    neighborhood: null,
    attendance_present: 24,
    attendance_total: 26,
    average_rating: 4.8,
    votes_count: 22,
  },
  {
    id: 'm-06',
    date: '2024-04-09',
    book_title: 'Torto Arado',
    book_author: 'Itamar Vieira Junior',
    place: 'Livraria da Vila',
    neighborhood: 'Pinheiros',
    attendance_present: 22,
    attendance_total: 26,
    average_rating: 4.6,
    votes_count: 20,
  },
  {
    id: 'm-07',
    date: '2024-03-12',
    book_title: 'A Hora da Estrela',
    book_author: 'Clarice Lispector',
    place: 'Casa da Ana',
    neighborhood: 'Menino Deus',
    attendance_present: 18,
    attendance_total: 24,
    average_rating: 4.3,
    votes_count: 15,
  },
  {
    id: 'm-08',
    date: '2024-02-14',
    book_title: 'Um Defeito de Cor',
    book_author: 'Ana Maria Gonçalves',
    place: 'Café Santo Grão',
    neighborhood: null,
    attendance_present: 20,
    attendance_total: 24,
    average_rating: 4.7,
    votes_count: 17,
  },
];

const meta = {
  title: 'Pages/GroupDetails',
  component: GroupDetails,

  parameters: {
    layout: 'fullscreen',
  },

  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/grupos/g-03']}>
        <Routes>
          <Route element={<DefaultLayout />}>
            <Route path="/grupos/:groupId" element={<Story />} />
          </Route>
        </Routes>
      </MemoryRouter>
    ),
  ],

  beforeEach: () => {
    mocked(getGroupDetails).mockResolvedValue(group);

    mocked(getGroupParticipantsPage).mockImplementation(async (_groupId, { page, pageSize }) => {
      await wait(REQUEST_DELAY);
      const start = (page - 1) * pageSize;
      return { items: participants.slice(start, start + pageSize), total: participants.length };
    });

    mocked(getGroupMeetingsPage).mockImplementation(async (_groupId, { page, pageSize }) => {
      await wait(REQUEST_DELAY);
      const start = (page - 1) * pageSize;
      return { items: meetings.slice(start, start + pageSize), total: meetings.length };
    });
  },
} satisfies Meta<typeof GroupDetails>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  beforeEach: () => {
    mocked(getGroupDetails).mockImplementation(() => new Promise(() => {}));
  },
};

export const LoadError: Story = {
  beforeEach: () => {
    mocked(getGroupDetails).mockRejectedValue(new Error('fail'));
  },
};

export const EmptyParticipants: Story = {
  beforeEach: () => {
    mocked(getGroupParticipantsPage).mockResolvedValue({ items: [], total: 0 });
  },
};

export const EmptyHistory: Story = {
  beforeEach: () => {
    mocked(getGroupMeetingsPage).mockResolvedValue({ items: [], total: 0 });
  },
};
