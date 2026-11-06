import { fireEvent, screen } from '@testing-library/react';
import { locale } from '../../locales';
import { renderWithProviders } from '../../test/render';
import { Sidebar } from './Sidebar';

const text = locale.sidebar;
const user = { name: 'Claudine' };

describe('Sidebar', () => {
  it('lista os links de navegação', () => {
    renderWithProviders(<Sidebar user={user} />);

    expect(screen.getByRole('link', { name: text.nav.grupos })).toHaveAttribute('href', '/grupos');
    expect(screen.getByRole('link', { name: text.nav.participantes })).toHaveAttribute(
      'href',
      '/participantes',
    );
    expect(screen.getByRole('link', { name: text.nav.dashboard })).toHaveAttribute('href', '/');
  });

  it('destaca o link da página atual', () => {
    renderWithProviders(<Sidebar user={user} />, { route: '/grupos' });

    expect(screen.getByRole('link', { name: text.nav.grupos })).toHaveAttribute(
      'aria-current',
      'page',
    );
    // o dashboard ("/") só fica ativo na raiz exata
    expect(screen.getByRole('link', { name: text.nav.dashboard })).not.toHaveAttribute(
      'aria-current',
    );
  });

  it('recolhe e expande sozinha quando não é controlada', async () => {
    const { user: u } = renderWithProviders(<Sidebar user={user} />);
    const toggle = screen.getByRole('button', { name: text.toggle.collapse });
    expect(toggle).toHaveAttribute('aria-expanded', 'true');

    await u.click(toggle);

    expect(screen.getByRole('button', { name: text.toggle.expand })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  it('controlada, só avisa o pai', async () => {
    const onToggleCollapse = jest.fn();
    const { user: u } = renderWithProviders(
      <Sidebar user={user} collapsed={false} onToggleCollapse={onToggleCollapse} />,
    );

    await u.click(screen.getByRole('button', { name: text.toggle.collapse }));

    expect(onToggleCollapse).toHaveBeenCalled();
    expect(screen.getByRole('button', { name: text.toggle.collapse })).toBeInTheDocument();
  });

  it('mostra o título do link quando recolhida', () => {
    renderWithProviders(<Sidebar user={user} defaultCollapsed />);

    expect(screen.getByRole('link', { name: text.nav.grupos })).toHaveAttribute(
      'title',
      text.nav.grupos,
    );
  });

  it('mostra a usuária e a inicial no avatar', () => {
    renderWithProviders(<Sidebar user={user} />);

    expect(screen.getByText('Claudine')).toBeInTheDocument();
    expect(screen.getByText('C')).toBeInTheDocument();
  });

  it('mostra a foto no avatar quando há photoUrl', () => {
    const { container } = renderWithProviders(
      <Sidebar user={{ name: 'Claudine', photoUrl: 'https://exemplo.test/foto.jpg' }} />,
    );

    expect(container.querySelector('img[src="https://exemplo.test/foto.jpg"]')).toBeInTheDocument();
    expect(screen.queryByText('C')).not.toBeInTheDocument();
  });

  it('volta a mostrar a inicial quando a foto não carrega', () => {
    const { container } = renderWithProviders(
      <Sidebar user={{ name: 'Claudine', photoUrl: 'https://exemplo.test/quebrada.jpg' }} />,
    );

    fireEvent.error(container.querySelector('img[src="https://exemplo.test/quebrada.jpg"]')!);

    expect(screen.getByText('C')).toBeInTheDocument();
  });

  it('chama onLogout ao sair', async () => {
    const onLogout = jest.fn();
    const { user: u } = renderWithProviders(<Sidebar user={user} onLogout={onLogout} />);

    await u.click(screen.getByRole('button', { name: text.logout }));

    expect(onLogout).toHaveBeenCalled();
  });

  it('chama onNavigate ao clicar num link', async () => {
    const onNavigate = jest.fn();
    const { user: u } = renderWithProviders(<Sidebar user={user} onNavigate={onNavigate} />);

    await u.click(screen.getByRole('link', { name: text.nav.grupos }));

    expect(onNavigate).toHaveBeenCalled();
  });
});
