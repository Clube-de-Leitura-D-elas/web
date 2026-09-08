/**
 * Ensina o styled-components a conhecer o nosso tema.
 *
 * É graças a este arquivo que, dentro de qualquer `styles.ts`, o `theme` já vem tipado:
 * o autocomplete lista todas as cores e o TypeScript reclama se você errar o nome.
 *
 *   color: ${({ theme }) => theme.textBrand};
 *
 * Não é preciso importar nada para isso funcionar. Não mexa aqui.
 */
import 'styled-components';
import type { AppTheme } from './theme';

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends AppTheme {}
}
