import type { Preview } from '@storybook/react-vite';
import { sb } from 'storybook/test';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from '../src/theme/GlobalStyle';
import { theme } from '../src/theme/theme';

import '@fontsource/nunito/400.css';
import '@fontsource/nunito/600.css';
import '@fontsource/nunito/700.css';

// Troca os services pela versão em `src/services/__mocks__/`, para as stories não chamarem o Supabase.
sb.mock(import('../src/services/example_bookService.ts'));

const preview: Preview = {
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Story />
      </ThemeProvider>
    ),
  ],
  parameters: {
    // O fundo vem do GlobalStyle, que já segue o tema — o addon de backgrounds só atrapalharia.
    backgrounds: { disable: true },
    controls: { expanded: true },
    options: {
      storySort: { order: ['Componentes', ['Tag']] },
    },
  },
};

export default preview;
