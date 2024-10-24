import { Outlet } from 'react-router-dom';
import { Global, ThemeProvider } from '@emotion/react';
import globalStyles from './styles/globalStyles';
import { theme } from './styles/theme';

const App = () => {
  return (
    <ThemeProvider theme={theme(true)}>
      <Global styles={globalStyles} />
      <Outlet />
    </ThemeProvider>
  );
};

export default App;
