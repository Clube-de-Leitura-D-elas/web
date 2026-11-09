import { render, type RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement, ReactNode } from 'react';
import { MemoryRouter, Route, Routes, useLocation, useNavigate } from 'react-router';
import { ThemeProvider } from 'styled-components';
import { theme } from '../theme/theme';

type RenderWithProvidersOptions = Omit<RenderOptions, 'wrapper'> & {
  route?: string;
  path?: string;
  showLocationSearch?: boolean;
  showHistoryBackButton?: boolean;
};

/** Mostra o endereço atual, para o teste conferir para onde a tela navegou. */
export const LocationDisplay = () => {
  const location = useLocation();
  return <div data-testid="location">{location.pathname}</div>;
};

const LocationSearchDisplay = () => {
  const location = useLocation();

  return <div data-testid="location-search">{location.search}</div>;
};

const HistoryBackButton = () => {
  const navigate = useNavigate();

  return (
    <button type="button" onClick={() => navigate(-1)}>
      Voltar no histórico
    </button>
  );
};

/**
 * Renderiza com o tema do styled-components e um router em memória, como a aplicação faz em
 * `main.tsx`. Devolve também uma instância do `userEvent`, já pronta para uso.
 */
export function renderWithProviders(
  ui: ReactElement,
  {
    route = '/',
    path,
    showLocationSearch = false,
    showHistoryBackButton = false,
    ...options
  }: RenderWithProvidersOptions = {},
) {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={[route]}>
        <>
          {path ? (
            <Routes>
              <Route path={path} element={children} />
              <Route path="*" element={<LocationDisplay />} />
            </Routes>
          ) : (
            children
          )}

          {showLocationSearch && <LocationSearchDisplay />}
          {showHistoryBackButton && <HistoryBackButton />}
        </>
      </MemoryRouter>
    </ThemeProvider>
  );

  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper: Wrapper, ...options }),
  };
}

/** Promise que nunca resolve: deixa a tela presa no estado de carregamento. */
export const pending = <T,>() => new Promise<T>(() => {});
