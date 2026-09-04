/**
 * Provider do tema. Envolve a aplicação inteira (ver `src/main.tsx`).
 *
 * Responsabilidades:
 *  - escolher o modo inicial (o que estiver salvo > preferência do sistema > claro);
 *  - guardar a escolha no localStorage;
 *  - entregar o tema para o styled-components e montar os estilos globais.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from './GlobalStyle';
import { themes } from './theme';
import type { ThemeMode } from './theme';
import { THEME_MODE_STORAGE_KEY, ThemeModeContext } from './themeModeContext';

function getInitialMode(): ThemeMode {
  const saved = localStorage.getItem(THEME_MODE_STORAGE_KEY);
  if (saved === 'light' || saved === 'dark') {
    return saved;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

type AppThemeProviderProps = {
  children: ReactNode;
};

export function AppThemeProvider({ children }: AppThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>(getInitialMode);

  useEffect(() => {
    localStorage.setItem(THEME_MODE_STORAGE_KEY, mode);
  }, [mode]);

  const toggleMode = useCallback(() => {
    setMode((current) => (current === 'light' ? 'dark' : 'light'));
  }, []);

  const value = useMemo(() => ({ mode, toggleMode, setMode }), [mode, toggleMode]);

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={themes[mode]}>
        <GlobalStyle />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}
