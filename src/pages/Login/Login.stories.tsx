import type { Meta, StoryObj } from '@storybook/react-vite';
import type { User } from '@supabase/supabase-js';
import { expect, mocked } from 'storybook/test';
import { MemoryRouter, Route, Routes } from 'react-router';

import { locale } from '../../locales';
import { AuthServiceError } from '../../services/authErrors';
import { getCurrentUserRole, signInWithPassword, signOut } from '../../services/authService';
import type { AppRole } from '../../types/auth';

import { LoginPage } from '.';

const REQUEST_DELAY = 400;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const text = locale.login;

const credentials = {
  email: 'gestora@gmail.com',
  password: 'senha-secreta',
};

const USER_ID = '11111111-1111-1111-1111-111111111111';

/** Começa deslogada; depois do login, o papel no token passa a ser `appRole`. */
const mockLogin = (appRole: AppRole) => {
  let signedIn = false;

  mocked(signInWithPassword).mockImplementation(async () => {
    await wait(REQUEST_DELAY);
    signedIn = true;

    return { id: USER_ID, email: credentials.email } as User;
  });

  mocked(getCurrentUserRole).mockImplementation(async () => {
    if (!signedIn) throw new AuthServiceError('unauthenticated');

    return appRole;
  });
};

type PlayContext = Parameters<NonNullable<Story['play']>>[0];

const submitLogin = async ({ canvas, userEvent }: PlayContext) => {
  await userEvent.type(await canvas.findByLabelText(text.email.label), credentials.email);
  await userEvent.type(canvas.getByLabelText(text.password.label), credentials.password);
  await userEvent.click(canvas.getByRole('button', { name: text.submit }));
};

const meta = {
  title: 'Pages/Login',
  component: LoginPage,

  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Tela de entrada no painel de gestão.',
          '',
          'No desktop, a tela é dividida entre o painel da marca e o card de login.',
          'No mobile, o painel da marca some e o formulário ocupa a tela toda, sem card.',
          '',
          'Só perfis com acesso de gestão entram; os demais são deslogados na hora.',
          'Quem já está logada é mandada direto para o painel.',
        ].join('\n'),
      },
    },
  },

  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<Story />} />
          <Route path="/" element={<p>Painel de gestão</p>} />
        </Routes>
      </MemoryRouter>
    ),
  ],

  beforeEach: () => {
    mockLogin('FOUNDER');
  },
} satisfies Meta<typeof LoginPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Mobile: Story = {
  globals: {
    viewport: { value: 'mobile2', isRotated: false },
  },
};

export const Tablet: Story = {
  globals: {
    viewport: { value: 'tablet', isRotated: false },
  },
};

export const Success: Story = {
  play: async (context) => {
    await submitLogin(context);

    await expect(signInWithPassword).toHaveBeenCalledWith(credentials);
    await expect(await context.canvas.findByText('Painel de gestão')).toBeInTheDocument();
  },
};

export const ManagerAccess: Story = {
  beforeEach: () => {
    mockLogin('MANAGER');
  },

  play: async (context) => {
    await submitLogin(context);

    await expect(await context.canvas.findByText('Painel de gestão')).toBeInTheDocument();
    await expect(signOut).not.toHaveBeenCalled();
  },
};

export const AlreadyLoggedIn: Story = {
  beforeEach: () => {
    mocked(getCurrentUserRole).mockResolvedValue('FOUNDER');
  },

  play: async ({ canvas }) => {
    await expect(await canvas.findByText('Painel de gestão')).toBeInTheDocument();
    await expect(signInWithPassword).not.toHaveBeenCalled();
  },
};

export const Submitting: Story = {
  beforeEach: () => {
    mocked(signInWithPassword).mockImplementation(() => new Promise(() => {}));
  },

  play: async (context) => {
    await submitLogin(context);

    await expect(context.canvas.getByRole('button', { name: text.submitting })).toBeDisabled();
  },
};

export const InvalidCredentials: Story = {
  beforeEach: () => {
    mocked(signInWithPassword).mockRejectedValue(new AuthServiceError('invalid_credentials'));
  },

  play: async (context) => {
    await submitLogin(context);

    await expect(await context.canvas.findByRole('alert')).toHaveTextContent(
      text.errors.invalidCredentials,
    );
  },
};

export const NoAccess: Story = {
  beforeEach: () => {
    mockLogin('READER');
  },

  play: async (context) => {
    await submitLogin(context);

    await expect(await context.canvas.findByRole('alert')).toHaveTextContent(text.errors.noAccess);
    await expect(signOut).toHaveBeenCalled();
  },
};

export const LoadError: Story = {
  beforeEach: () => {
    mocked(getCurrentUserRole).mockRejectedValue(new AuthServiceError('unknown'));
  },

  play: async (context) => {
    await submitLogin(context);

    await expect(await context.canvas.findByRole('alert')).toHaveTextContent(text.errors.generic);
  },
};
