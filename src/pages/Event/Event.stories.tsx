import type { Meta, StoryObj } from '@storybook/react-vite';
import { mocked } from 'storybook/test';
import { MemoryRouter, Route, Routes } from 'react-router';
import { DefaultLayout } from '../../layouts/DefaultLayout';

import { getEventDetails } from '../../services/eventService';
import type { EventDetails as EventDetailsData } from '../../types/event';

import { EventDetails } from '.';

const REQUEST_DELAY = 400;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const event: EventDetailsData = {
  id: '9f2c1a44-8f3e-4c7a-9a1b-2d6f0e5b7c31',
  startsAt: '2026-08-22T19:00:00-03:00',
  group: {
    id: '3b7d9e21-5a4c-4f18-b2e7-8c1a6d4f9b02',
    name: 'Grupo 03 — Pinheiros',
    city: 'São Paulo',
  },
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
