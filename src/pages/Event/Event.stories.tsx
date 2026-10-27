import type { Meta, StoryObj } from '@storybook/react-vite';
import { mocked } from 'storybook/test';
import { MemoryRouter, Route, Routes } from 'react-router';
import { DefaultLayout } from '../../layouts/DefaultLayout';

import { getEventDetails } from '../../services/eventService';
import type {
  EventBook,
  EventDetails as EventDetailsData,
  EventHost,
  EventLocation,
} from '../../types/event';

import { EventDetails } from '.';

const REQUEST_DELAY = 400;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const book: EventBook = {
  id: '6c2a9b48-7d31-4f85-a0e3-4b7c1d9e2f56',
  title: 'Dom Casmurro',
  author: 'Machado de Assis',
  coverUrl: 'https://picsum.photos/seed/livro-1/400/600',
};

const location: EventLocation = {
  name: 'Livraria da Vila — Pinheiros',
  address: 'Rua Fradique Coutinho, 915 — São Paulo, SP',
};

const host: EventHost = {
  id: '5e1f8c37-2b6d-4a09-9c84-7f3e1d5b2a60',
  name: 'Beatriz Souza',
  photoUrl: 'https://picsum.photos/seed/anfitria-1/200/200',
};

const event: EventDetailsData = {
  id: '9f2c1a44-8f3e-4c7a-9a1b-2d6f0e5b7c31',
  startsAt: '2026-08-22T19:00:00-03:00',
  group: {
    id: '3b7d9e21-5a4c-4f18-b2e7-8c1a6d4f9b02',
    name: 'Grupo 03 — Pinheiros',
    city: 'São Paulo',
  },
  book,
  location,
  host,
};

const meta = {
  title: 'Pages/Event',
  component: EventDetails,

  parameters: {
    layout: 'fullscreen',
  },

  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={[`/eventos/${event.id}`]}>
        <Routes>
          <Route element={<DefaultLayout />}>
            <Route path="/eventos/:eventId" element={<Story />} />
          </Route>
        </Routes>
      </MemoryRouter>
    ),
  ],

  beforeEach: () => {
    mocked(getEventDetails).mockImplementation(async () => {
      await wait(REQUEST_DELAY);

      return event;
    });
  },
} satisfies Meta<typeof EventDetails>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// minuto diferente de 00: o horário aparece como 19h30
export const WithMinutes: Story = {
  beforeEach: () => {
    mocked(getEventDetails).mockResolvedValue({ ...event, startsAt: '2026-08-22T19:30:00-03:00' });
  },
};

// livro sem capa cadastrada: aparece o placeholder
export const BookWithoutCover: Story = {
  beforeEach: () => {
    mocked(getEventDetails).mockResolvedValue({ ...event, book: { ...book, coverUrl: null } });
  },
};

// URL de capa que não carrega: o <img> falha e cai no placeholder
export const BookBrokenCover: Story = {
  beforeEach: () => {
    mocked(getEventDetails).mockResolvedValue({
      ...event,
      book: { ...book, coverUrl: '/capa-inexistente.jpg' },
    });
  },
};

// evento sem livro definido: estado vazio
export const WithoutBook: Story = {
  beforeEach: () => {
    mocked(getEventDetails).mockResolvedValue({ ...event, book: null });
  },
};

// títulos e autores longos quebram dentro do card, sem estourar o layout
export const BookLongNames: Story = {
  beforeEach: () => {
    mocked(getEventDetails).mockResolvedValue({
      ...event,
      book: {
        ...book,
        title: 'Uma História Muito Longa de um Livro com um Título Extraordinariamente Comprido',
        author: 'Autora Com Um Nome Completo Também Bastante Extenso e Composto',
      },
    });
  },
};

// evento sem local definido: estado vazio só no local, a anfitriã continua aparecendo
export const WithoutLocation: Story = {
  beforeEach: () => {
    mocked(getEventDetails).mockResolvedValue({ ...event, location: null });
  },
};

// local cadastrado sem endereço: aparece "Endereço não informado"
export const LocationWithoutAddress: Story = {
  beforeEach: () => {
    mocked(getEventDetails).mockResolvedValue({
      ...event,
      location: { ...location, address: null },
    });
  },
};

// evento sem anfitriã definida: estado vazio só na anfitriã
export const WithoutHost: Story = {
  beforeEach: () => {
    mocked(getEventDetails).mockResolvedValue({ ...event, host: null });
  },
};

// anfitriã sem foto: aparece o avatar placeholder
export const HostWithoutPhoto: Story = {
  beforeEach: () => {
    mocked(getEventDetails).mockResolvedValue({ ...event, host: { ...host, photoUrl: null } });
  },
};

// URL de foto que não carrega: o <img> falha e cai no avatar placeholder
export const HostBrokenPhoto: Story = {
  beforeEach: () => {
    mocked(getEventDetails).mockResolvedValue({
      ...event,
      host: { ...host, photoUrl: '/foto-inexistente.jpg' },
    });
  },
};

// nomes e endereços longos quebram dentro do card, sem estourar o layout
export const PlaceAndHostLongNames: Story = {
  beforeEach: () => {
    mocked(getEventDetails).mockResolvedValue({
      ...event,
      location: {
        name: 'Livraria e Café Literário Independente da Vila Madalena e Arredores Associados',
        address:
          'Avenida Engenheiro Luís Carlos Berrini, 1.500, Conjunto 101, Edifício Comercial Torre Norte — Cidade Monções, São Paulo, SP',
      },
      host: {
        ...host,
        name: 'Maria Beatriz de Albuquerque Souza Cavalcanti dos Santos Oliveira Lima',
      },
    });
  },
};

export const Loading: Story = {
  beforeEach: () => {
    mocked(getEventDetails).mockImplementation(() => new Promise(() => {}));
  },
};

export const NotFound: Story = {
  beforeEach: () => {
    mocked(getEventDetails).mockRejectedValue(new Error('EVENT_NOT_FOUND'));
  },
};
