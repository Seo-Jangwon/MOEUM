import Header from '@/components/Header/Header';
import { theme } from '@/styles/theme';
import globalStyles from '@/styles/globalStyles';
import { ThemeProvider, Global } from '@emotion/react';
import { Outlet, useLocation } from 'react-router-dom';
import {
  backgroundContainBallPaths,
  headerWithoutSearchPaths,
  WithoutHeaderPaths,
} from '@/constants/path/pathMap';
import useThemeStore from '@/stores/themeStore';
import { Suspense } from 'react';
import Background from '@/components/Background/Background';

const getHeader = (pathName: string) => {
  if (WithoutHeaderPaths.includes(pathName)) return null;
  if (headerWithoutSearchPaths.includes(pathName)) return <Header search={false} />;
  return <Header search={true} />;
};

const getBackground = (pathName: string) => {
  if (backgroundContainBallPaths.includes(pathName)) return <Background ball="contain" />;
  return <Background />;
};

const AppLayout = () => {
  const location = useLocation();
  const isLightMode = useThemeStore((state) => state.lightMode);
  const pathName = location.pathname;

  return (
    <ThemeProvider theme={theme(isLightMode)}>
      <Global styles={globalStyles} />
      <div css={{ display: 'flex', flexDirection: 'column', width: '100vw' }}>
        {getBackground(pathName)}
        {getHeader(pathName)}
        <Suspense>
          <Outlet />
        </Suspense>
      </div>
    </ThemeProvider>
  );
};

export default AppLayout;
