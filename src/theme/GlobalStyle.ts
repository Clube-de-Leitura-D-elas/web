/**
 * Estilos globais da aplicação: reset básico + cores e fonte vindas do tema.
 *
 * É montado uma única vez pelo `AppThemeProvider`. Estilo de componente NÃO entra aqui —
 * vai no `styles.ts` da pasta do componente.
 */
import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  :root {
    font-family: 'Nunito', system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color-scheme: ${({ theme }) => theme.mode};
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    min-height: 100vh;
    background-color: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
  }

  img,
  picture,
  video,
  canvas,
  svg {
    display: block;
    max-width: 100%;
  }

  button,
  input,
  select,
  textarea {
    font: inherit;
    color: inherit;
  }

  /* Anel de foco padrão, para o teclado continuar navegável em todo componente. */
  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.focusRing};
    outline-offset: 2px;
  }
`;
