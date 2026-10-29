import { screen, waitFor } from '@testing-library/react';
import { Route, Routes } from 'react-router';
import { locale } from '../../locales';
import { signOut } from '../../services/authService';
import { setMatchMedia } from '../../test/matchMedia';
import { LocationDisplay, renderWithProviders } from '../../test/render';
import { DefaultLayout } from '.';
import { MOBILE_QUERY, TABLET_QUERY } from './styles';

jest.mock('../../services/authService', () => ({
  ...jest.requireActual('../../services/authService'),
  signOut: jest.fn(),
}));

const renderLayout = () =>
  renderWithProviders(
    <Routes>
      <Route element={<DefaultLayout />}>
        <Route path="/grupos" element={<p>conteúdo da página</p>} />
      </Route>
      <Route path="/login" element={<LocationDisplay />} />
    </Routes>,
    { route: '/grupos' },
  );

describe('DefaultLayout', () => {
  it('renderiza a página da rota ao lado do menu', () => {
    renderLayout();

    expect(screen.getByText('conteúdo da página')).toBeInTheDocument();
    expect(screen.getByRole('complementary', { name: locale.sidebar.label })).toBeInTheDocument();
  });

  it('vai para o login depois de sair', async () => {
    jest.mocked(signOut).mockResolvedValue();
    const { user } = renderLayout();

    await user.click(screen.getByRole('button', { name: locale.sidebar.logout }));

    expect(await screen.findByTestId('location')).toHaveTextContent('/login');
  });

  it('continua no painel se o logout falhar', async () => {
    jest.mocked(signOut).mockRejectedValue(new Error('falhou'));
    const { user } = renderLayout();

    await user.click(screen.getByRole('button', { name: locale.sidebar.logout }));

    await waitFor(() => expect(signOut).toHaveBeenCalled());
    expect(screen.getByText('conteúdo da página')).toBeInTheDocument();
  });

  it('começa com o menu recolhido no tablet', () => {
    setMatchMedia((query) => query === TABLET_QUERY);

    renderLayout();

    expect(screen.getByRole('button', { name: locale.sidebar.toggle.expand })).toBeInTheDocument();
  });

  describe('no celular', () => {
    // A barra do topo só aparece via @media, que o jsdom não avalia: para ele, ela segue oculta.
    const getMenuButton = () =>
      screen.getByRole('button', { name: locale.layout.openMenu, hidden: true });

    beforeEach(() => {
      setMatchMedia((query) => query === MOBILE_QUERY || query === TABLET_QUERY);
    });

    it('abre a gaveta pelo botão de menu e fecha com Esc', async () => {
      const { user } = renderLayout();
      const menuButton = getMenuButton();
      expect(menuButton).toHaveAttribute('aria-expanded', 'false');

      await user.click(menuButton);
      expect(menuButton).toHaveAttribute('aria-expanded', 'true');
      expect(document.body.style.overflow).toBe('hidden');

      await user.keyboard('{Escape}');
      expect(menuButton).toHaveAttribute('aria-expanded', 'false');
      expect(document.body.style.overflow).toBe('');
    });

    it('fecha a gaveta ao navegar', async () => {
      const { user } = renderLayout();
      const menuButton = getMenuButton();

      await user.click(menuButton);
      await user.click(screen.getByRole('link', { name: locale.sidebar.nav.grupos }));

      expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    });
  });
});
