import Header from '@/components/Header/Header';
import { theme } from '@/styles/theme';
import globalStyles from '@/styles/globalStyles';
import { ThemeProvider, Global } from '@emotion/react';
import { Outlet, useLocation } from 'react-router-dom';
import { s_container, s_content } from './style';
import {
  backgroundWithBallPaths,
  headerWithoutSearchPaths,
  WithoutHeaderPaths,
} from '@/constants/path/pathMap';
import BackgroundWithBall from '@/components/Background/BackgroundWithBall';
import useThemeStore from '@/stores/themeStore';
import { Suspense } from 'react';

const getHeader = (pathName: string) => {
  if (WithoutHeaderPaths.includes(pathName)) return null;
  if (headerWithoutSearchPaths.includes(pathName)) return <Header search={false} />;
  return <Header search={true} />;
};

const getBackground = (pathName: string) => {
  if (backgroundWithBallPaths.includes(pathName)) return <BackgroundWithBall />;
};

const AppLayout = () => {
  const location = useLocation();
  const isLightMode = useThemeStore((state) => state.lightMode);
  const pathName = location.pathname;

  return (
    <ThemeProvider theme={theme(isLightMode)}>
      <Global styles={globalStyles} />
      <div css={s_container}>
        {getBackground(pathName)}
        {getHeader(pathName)}
        <div css={s_content}>
          <Suspense>
            <Outlet />
          </Suspense>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default AppLayout;
