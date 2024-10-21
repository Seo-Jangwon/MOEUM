import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AppRouter from './router/AppRouter';
import { Global, ThemeProvider } from '@emotion/react';
import globalStyles from './styles/globalStyles';
import theme from './styles/theme';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <Global styles={globalStyles} />
      <AppRouter />
    </ThemeProvider>
  </StrictMode>,
);
