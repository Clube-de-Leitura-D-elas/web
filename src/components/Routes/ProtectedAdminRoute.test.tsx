import { screen } from '@testing-library/react';
import { Route, Routes } from 'react-router';
import { useAdminAccess } from '../../hooks/useAdminAccess';
import { locale } from '../../locales';
import { LocationDisplay, renderWithProviders } from '../../test/render';
import { ProtectedAdminRoute } from './ProtectedAdminRoute';

jest.mock('../../hooks/useAdminAccess', () => ({ useAdminAccess: jest.fn() }));

const renderRoute = () =>
  renderWithProviders(
    <Routes>
      <Route element={<ProtectedAdminRoute />}>
        <Route path="/grupos" element={<p>página protegida</p>} />
      </Route>
      <Route path="/login" element={<LocationDisplay />} />
    </Routes>,
    { route: '/grupos' },
  );

describe('ProtectedAdminRoute', () => {
  it('mostra o carregamento enquanto confere o acesso', () => {
    jest.mocked(useAdminAccess).mockReturnValue('checking');

    renderRoute();

    expect(screen.getByText(locale.auth.loading)).toBeInTheDocument();
    expect(screen.queryByText('página protegida')).not.toBeInTheDocument();
  });

  it('manda para o login sem acesso', () => {
    jest.mocked(useAdminAccess).mockReturnValue('denied');

    renderRoute();

    expect(screen.getByTestId('location')).toHaveTextContent('/login');
  });

  it('renderiza a página com acesso', () => {
    jest.mocked(useAdminAccess).mockReturnValue('allowed');

    renderRoute();

    expect(screen.getByText('página protegida')).toBeInTheDocument();
  });
});
