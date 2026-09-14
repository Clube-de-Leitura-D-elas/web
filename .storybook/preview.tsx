import type { Preview } from '@storybook/react-vite';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from '../src/theme/GlobalStyle';
import { theme } from '../src/theme/theme';
import { mocked, sb } from 'storybook/test';
import { AuthServiceError } from '../src/services/authErrors';
import { getProfileByCurrentUser, onSignOut, signOut } from '../src/services/authService';
import type { UserProfile } from '../src/types/auth';

import '@fontsource/nunito/400.css';
import '@fontsource/nunito/600.css';
import '@fontsource/nunito/700.css';

// O client usa o arquivo de src/services/__mocks__, então as stories não precisam do .env.
sb.mock(import('../src/services/supabaseClient.ts'));
sb.mock(import('../src/services/authService.ts'), { spy: true });

// Sessão falsa: toda story começa com uma gestora logada, para as rotas protegidas renderizarem.
// `signOut` encerra a sessão e avisa quem assinou `onSignOut`, como o Supabase faz.
// Para testar outro cenário, sobrescreva `getProfileByCurrentUser` no beforeEach da story.
const STORYBOOK_USER: UserProfile = {
  id: '00000000-0000-0000-0000-000000000000',
  name: 'Claudine',
  email: 'claudine@gmail.com',
  app_role: 'FOUNDER',
};

const preview: Preview = {
  beforeEach: () => {
    let profile: UserProfile | null = STORYBOOK_USER;
    const signOutListeners = new Set<() => void>();

    mocked(getProfileByCurrentUser).mockImplementation(async () => {
      if (!profile) throw new AuthServiceError('unauthenticated');
      return profile;
    });

    mocked(signOut).mockImplementation(async () => {
      profile = null;
      signOutListeners.forEach((listener) => listener());
    });

    mocked(onSignOut).mockImplementation((listener) => {
      signOutListeners.add(listener);
      return () => {
        signOutListeners.delete(listener);
      };
    });
  },

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
