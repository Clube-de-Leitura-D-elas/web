/**
 * Lê e altera o modo do tema (claro/escuro) de qualquer lugar da aplicação.
 *
 *   const { mode, toggleMode } = useThemeMode();
 *   <button onClick={toggleMode}>{mode === 'light' ? 'Escuro' : 'Claro'}</button>
 *
 * Para ler *cores*, você não precisa deste hook: dentro do `styles.ts` o `theme`
 * já chega pronto — `${({ theme }) => theme.primary}`.
 */
import { useContext } from 'react';
import { ThemeModeContext } from '../theme/themeModeContext';

export function useThemeMode() {
  const context = useContext(ThemeModeContext);

  if (!context) {
    throw new Error('useThemeMode precisa estar dentro de <AppThemeProvider>.');
  }

  return context;
}
