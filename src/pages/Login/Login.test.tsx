import { screen } from '@testing-library/react';
import { locale } from '../../locales';
import { AuthServiceError } from '../../services/authErrors';
import {
  getCurrentUserRole,
  onSignOut,
  signInWithPassword,
  signOut,
} from '../../services/authService';
import { pending, renderWithProviders } from '../../test/render';
import { LoginPage } from '.';

jest.mock('../../services/authService', () => ({
  ...jest.requireActual('../../services/authService'),
  signInWithPassword: jest.fn(),
  getCurrentUserRole: jest.fn(),
  signOut: jest.fn(),
  onSignOut: jest.fn(),
}));

const text = locale.login;

const renderLogin = () => renderWithProviders(<LoginPage />, { route: '/login', path: '/login' });

const fillAndSubmit = async (user: ReturnType<typeof renderLogin>['user']) => {
  await user.type(await screen.findByLabelText(text.email.label), 'gestora@gmail.com');
  await user.type(screen.getByLabelText(text.password.label), 'segredo');
  await user.click(screen.getByRole('button', { name: text.submit }));
};

beforeEach(() => {
  jest.mocked(onSignOut).mockReturnValue(() => {});
  // ao abrir a tela, ninguém está logado
  jest.mocked(getCurrentUserRole).mockRejectedValueOnce(new AuthServiceError('unauthenticated'));
});

describe('LoginPage', () => {
  it('mostra o carregamento enquanto confere a sessão', () => {
    jest.mocked(getCurrentUserRole).mockReset().mockReturnValue(pending());

    renderLogin();

    expect(screen.getByText(locale.auth.loading)).toBeInTheDocument();
  });

  it('manda para o painel quem já está logada como gestora', async () => {
    jest.mocked(getCurrentUserRole).mockReset().mockResolvedValue('FOUNDER');

    renderLogin();

    expect(await screen.findByTestId('location')).toHaveTextContent(/^\/$/);
  });

  it('entra com e-mail e senha e vai para o painel', async () => {
    jest.mocked(signInWithPassword).mockResolvedValue({} as never);
    jest.mocked(getCurrentUserRole).mockResolvedValue('MANAGER');
    const { user } = renderLogin();

    await fillAndSubmit(user);

    expect(signInWithPassword).toHaveBeenCalledWith({
      email: 'gestora@gmail.com',
      password: 'segredo',
    });
    expect(await screen.findByTestId('location')).toHaveTextContent(/^\/$/);
  });

  it('avisa quando e-mail ou senha estão errados', async () => {
    jest.mocked(signInWithPassword).mockRejectedValue(new AuthServiceError('invalid_credentials'));
    const { user } = renderLogin();

    await fillAndSubmit(user);

    expect(await screen.findByRole('alert')).toHaveTextContent(text.errors.invalidCredentials);
  });

  it('desloga e avisa quando o perfil não é de gestão', async () => {
    jest.mocked(signInWithPassword).mockResolvedValue({} as never);
    jest.mocked(getCurrentUserRole).mockResolvedValue('READER');
    jest.mocked(signOut).mockResolvedValue();
    const { user } = renderLogin();

    await fillAndSubmit(user);

    expect(await screen.findByRole('alert')).toHaveTextContent(text.errors.noAccess);
    expect(signOut).toHaveBeenCalled();
    expect(screen.queryByTestId('location')).not.toBeInTheDocument();
  });

  it('mostra uma mensagem genérica para outros erros', async () => {
    jest.mocked(signInWithPassword).mockRejectedValue(new AuthServiceError('unknown'));
    const { user } = renderLogin();

    await fillAndSubmit(user);

    expect(await screen.findByRole('alert')).toHaveTextContent(text.errors.generic);
  });

  it('desabilita o botão enquanto entra', async () => {
    jest.mocked(signInWithPassword).mockReturnValue(pending());
    const { user } = renderLogin();

    await fillAndSubmit(user);

    expect(screen.getByRole('button', { name: text.submitting })).toBeDisabled();
  });
});
