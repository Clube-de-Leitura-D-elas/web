import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/render';
import { Breadcrumb } from '.';

const renderBreadcrumb = (current?: string) =>
  renderWithProviders(
    <Breadcrumb
      ariaLabel="Navegação estrutural"
      parentLabel="Grupos"
      parentTo="/grupos"
      current={current}
    />,
  );

describe('Breadcrumb', () => {
  it('liga para a tela pai e marca a página atual', () => {
    renderBreadcrumb('Grupo 03');

    expect(screen.getByRole('navigation', { name: 'Navegação estrutural' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Grupos' })).toHaveAttribute('href', '/grupos');
    expect(screen.getByText('Grupo 03')).toHaveAttribute('aria-current', 'page');
  });

  it('sem página atual, mostra só o link', () => {
    renderBreadcrumb();

    expect(screen.queryByText('/')).not.toBeInTheDocument();
  });

  it('sem histórico, segue o link para a tela pai', async () => {
    const { user } = renderWithProviders(
      <Breadcrumb ariaLabel="Navegação" parentLabel="Grupos" parentTo="/grupos" />,
      { route: '/grupos/g1', path: '/grupos/:groupId' },
    );

    await user.click(screen.getByRole('link', { name: 'Grupos' }));

    expect(screen.getByTestId('location')).toHaveTextContent('/grupos');
  });
});
