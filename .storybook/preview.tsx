import { withThemeFromJSXProvider } from '@storybook/addon-themes';
import type { Preview } from '@storybook/react-vite';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from '../src/theme/GlobalStyle';
import { darkTheme, lightTheme } from '../src/theme/theme';

import '@fontsource/nunito/400.css';
import '@fontsource/nunito/600.css';
import '@fontsource/nunito/700.css';

const preview: Preview = {
  decorators: [
    // Liga o seletor de tema da barra de ferramentas (ícone de pincel) ao ThemeProvider.
    // Alterne claro/escuro por lá para conferir se o componente usa os tokens certos.
    withThemeFromJSXProvider({
      themes: { light: lightTheme, dark: darkTheme },
      defaultTheme: 'light',
      Provider: ThemeProvider,
      GlobalStyles: GlobalStyle,
    }),
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
