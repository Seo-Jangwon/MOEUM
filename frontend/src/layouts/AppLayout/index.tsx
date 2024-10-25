import Header from '@/components/Header/Header';
import { theme } from '@/styles/theme';
import globalStyles from '@/styles/globalStyles';
import { ThemeProvider, Global } from '@emotion/react';
import { Outlet, useLocation } from 'react-router-dom';
import { s_container } from './style';

const AppLayout = () => {
  const location = useLocation();
  const pathName = location.pathname;
  const searchHeaderPath = ['/signin', '/signup'];

  const getHeader = (pathName: string) => {
    if (searchHeaderPath.includes(pathName)) return <Header search={false} />;
    return <Header search={true} />;
  };

  return (
    <ThemeProvider theme={theme(true)}>
      <Global styles={globalStyles} />
      <div css={s_container}>
        {getHeader(pathName)}
        <Outlet />
      </div>
    </ThemeProvider>
  );
};

export default AppLayout;
