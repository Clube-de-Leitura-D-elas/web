import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, mocked } from 'storybook/test';
import { MemoryRouter, Route, Routes } from 'react-router';

import { DefaultLayout } from '../../layouts/DefaultLayout';
import { locale } from '../../locales';
import LoginPage from '../../pages/Login';
import { AuthServiceError } from '../../services/authErrors';
import { getProfileByCurrentUser, signOut } from '../../services/authService';

import ProtectedAdminRoute from './ProtectedAdminRoute';

const PROTECTED_CONTENT = 'Conteúdo protegido';

const USER_ID = '11111111-1111-1111-1111-111111111111';

const meta = {
  title: 'Componentes/ProtectedAdminRoute',
  component: ProtectedAdminRoute,

  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Protege as rotas do painel: só perfis de gestão (`MANAGER` ou `FOUNDER`) logados entram.',
          'Quem não está logado, ou não tem acesso, é mandado para `/login`.',
          'Se a sessão terminar com a tela aberta (logout em outra aba, token expirado),',
          'a usuária também volta para o login.',
          '',
          '### Como usar',
          '',
          'Envolva as rotas que precisam de login em `src/App.tsx`:',
          '',
          '```tsx',
          '<Route element={<ProtectedAdminRoute />}>',
          '  <Route path="/" element={<DefaultLayout />}>',
          '    {/* páginas protegidas */}',
          '  </Route>',
          '</Route>',
          '```',
          '',
          'Nas stories, uma gestora já vem logada por padrão (`.storybook/preview.tsx`).',
        ].join('\n'),
      },
    },
  },

  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<Story />}>
            <Route path="/" element={<DefaultLayout />}>
              <Route index element={<p>{PROTECTED_CONTENT}</p>} />
            </Route>
          </Route>
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof ProtectedAdminRoute>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Founder: Story = {
  play: async ({ canvas }) => {
    await expect(await canvas.findByText(PROTECTED_CONTENT)).toBeInTheDocument();
  },
};

export const Manager: Story = {
  beforeEach: () => {
    mocked(getProfileByCurrentUser).mockResolvedValue({ id: USER_ID, app_role: 'MANAGER' });
  },

  play: async ({ canvas }) => {
    await expect(await canvas.findByText(PROTECTED_CONTENT)).toBeInTheDocument();
  },
};

export const Loading: Story = {
  beforeEach: () => {
    mocked(getProfileByCurrentUser).mockImplementation(() => new Promise(() => {}));
  },

  play: async ({ canvas }) => {
    await expect(await canvas.findByText(locale.auth.loading)).toBeInTheDocument();
  },
};

export const Unauthenticated: Story = {
  beforeEach: () => {
    mocked(getProfileByCurrentUser).mockRejectedValue(new AuthServiceError('unauthenticated'));
  },

  play: async ({ canvas }) => {
    await expect(await canvas.findByText(locale.login.title)).toBeInTheDocument();
  },
};

export const Logout: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(await canvas.findByRole('button', { name: locale.sidebar.logout }));

    await expect(signOut).toHaveBeenCalled();
    await expect(await canvas.findByText(locale.login.title)).toBeInTheDocument();
  },
};

export const SessionEnded: Story = {
  play: async ({ canvas }) => {
    await canvas.findByText(PROTECTED_CONTENT);

    // Simula a sessão terminando fora desta tela, sem clicar em "Sair".
    await signOut();

    await expect(await canvas.findByText(locale.login.title)).toBeInTheDocument();
  },
};

export const WithoutAccess: Story = {
  beforeEach: () => {
    mocked(getProfileByCurrentUser).mockResolvedValue({ id: USER_ID, app_role: 'READER' });
  },

  play: async ({ canvas }) => {
    await expect(await canvas.findByText(locale.login.title)).toBeInTheDocument();
  },
};
