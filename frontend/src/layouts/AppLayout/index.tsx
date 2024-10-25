import Header from '@/components/Header/Header';
import { theme } from '@/styles/theme';
import globalStyles from '@/styles/globalStyles';
import { ThemeProvider, Global } from '@emotion/react';
import { Outlet, useLocation } from 'react-router-dom';
import { s_container } from './style';
import { backgroundWithBallPaths, headerWithoutSearchPaths } from '@/constants/path/pathMap';
import BackgroundWithBall from '@/components/Background/BackgroundWithBall';

const AppLayout = () => {
  const location = useLocation();
  const pathName = location.pathname;

  const getHeader = (pathName: string) => {
    if (headerWithoutSearchPaths.includes(pathName)) return <Header search={false} />;
    return <Header search={true} />;
  };

  const getBackground = (pathName: string) => {
    if (backgroundWithBallPaths.includes(pathName)) return <BackgroundWithBall />;
  };

  return (
    <ThemeProvider theme={theme(true)}>
      <Global styles={globalStyles} />
      <div css={s_container}>
        {getHeader(pathName)}
        {getBackground(pathName)}
        <Outlet />
      </div>
    </ThemeProvider>
  );
};

export default AppLayout;
