import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router';
import { mocked } from 'storybook/test';
import { getAbsences } from '../../services/dashboardService';
import { AbsencesList } from './AbsencesList';
import { ABSENCES } from './storyData';

const REQUEST_DELAY = 400;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const meta = {
  title: 'Componentes/AbsencesList',
  component: AbsencesList,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div style={{ maxWidth: '64rem', padding: '1.5rem' }}>
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
  beforeEach: () => {
    mocked(getAbsences).mockImplementation(async () => {
      await wait(REQUEST_DELAY);

      return ABSENCES;
    });
  },
} satisfies Meta<typeof AbsencesList>;

export default meta;

type Story = StoryObj<typeof meta>;

// 8 linhas: com 6 por página, aparece a paginação
export const Default: Story = {};

export const Loading: Story = {
  beforeEach: () => {
    mocked(getAbsences).mockImplementation(() => new Promise(() => {}));
  },
};

// ninguém faltou aos 3 últimos encontros
export const Empty: Story = {
  beforeEach: () => {
    mocked(getAbsences).mockResolvedValue([]);
  },
};

// function com erro (ex.: sem permissão): aviso com "Tentar novamente"
export const Error: Story = {
  beforeEach: () => {
    mocked(getAbsences).mockRejectedValue(new globalThis.Error('500'));
  },
};
