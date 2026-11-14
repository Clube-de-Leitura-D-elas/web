import { fireEvent, screen } from '@testing-library/react';
import { Link, Route, Routes } from 'react-router';
import { LocationDisplay, renderWithProviders } from '../../test/render';
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

  const renderFromList = () =>
    renderWithProviders(
      <Routes>
        <Route
          path="/grupos"
          element={
            <>
              <Link to="/grupos/g1">Abrir grupo</Link>
              <LocationDisplay />
            </>
          }
        />
        <Route
          path="/grupos/:groupId"
          element={<Breadcrumb ariaLabel="Navegação" parentLabel="Grupos" parentTo="/grupos" />}
        />
      </Routes>,
      { route: '/grupos?cidade=canoas', showLocationSearch: true },
    );

  it('com histórico, volta para a lista mantendo os filtros', async () => {
    const { user } = renderFromList();

    await user.click(screen.getByRole('link', { name: 'Abrir grupo' }));
    await user.click(screen.getByRole('link', { name: 'Grupos' }));

    expect(screen.getByTestId('location')).toHaveTextContent('/grupos');
    expect(screen.getByTestId('location-search')).toHaveTextContent('?cidade=canoas');
  });

  it('com Ctrl ou Cmd, não troca a navegação da aba atual', async () => {
    const { user } = renderFromList();

    await user.click(screen.getByRole('link', { name: 'Abrir grupo' }));
    fireEvent.click(screen.getByRole('link', { name: 'Grupos' }), { ctrlKey: true });

    expect(screen.queryByTestId('location')).not.toBeInTheDocument();
  });
});
