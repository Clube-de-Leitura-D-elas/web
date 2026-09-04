/**
 * Contexto que guarda o modo do tema (claro ou escuro).
 *
 * Fica separado do `AppThemeProvider.tsx` só por causa do hot reload do React:
 * um arquivo .tsx deve exportar apenas componentes.
 *
 * Você não usa este arquivo direto — use o hook `useThemeMode()`.
 */
import { createContext } from 'react';
import type { ThemeMode } from './theme';

export type ThemeModeContextValue = {
  /** Modo atual: 'light' ou 'dark'. */
  mode: ThemeMode;
  /** Alterna entre claro e escuro. */
  toggleMode: () => void;
  /** Força um modo específico. */
  setMode: (mode: ThemeMode) => void;
};

export const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

export const THEME_MODE_STORAGE_KEY = 'clube-de-leitura:theme-mode';
