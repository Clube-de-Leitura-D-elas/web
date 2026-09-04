import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App.tsx';
import { AppThemeProvider } from './theme/AppThemeProvider.tsx';

import '@fontsource/nunito/400.css';
import '@fontsource/nunito/600.css';
import '@fontsource/nunito/700.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AppThemeProvider>
  </StrictMode>,
);
