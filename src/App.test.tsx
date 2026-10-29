import { screen } from '@testing-library/react';
import { App } from './App';
import { locale } from './locales';
import { AuthServiceError } from './services/authErrors';
import { getCurrentUserRole, onSignOut } from './services/authService';
import { renderWithProviders } from './test/render';

jest.mock('./services/authService', () => ({
  ...jest.requireActual('./services/authService'),
  getCurrentUserRole: jest.fn(),
  onSignOut: jest.fn(),
}));

beforeEach(() => {
  jest.mocked(onSignOut).mockReturnValue(() => {});
  jest.mocked(getCurrentUserRole).mockRejectedValue(new AuthServiceError('unauthenticated'));
});

describe('App', () => {
  it('mostra a página 404 para endereços desconhecidos', () => {
    renderWithProviders(<App />, { route: '/nao-existe' });

    expect(screen.getByRole('heading', { name: locale.notFound.title })).toBeInTheDocument();
  });

  it.each(['/', '/grupos', '/participantes/p1'])(
    'manda para o login quem acessa %s sem sessão',
    async (route) => {
      renderWithProviders(<App />, { route });

      expect(await screen.findByRole('heading', { name: locale.login.title })).toBeInTheDocument();
    },
  );
});
