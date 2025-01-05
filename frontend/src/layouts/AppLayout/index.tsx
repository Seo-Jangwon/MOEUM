import Background from '@/components/Background/Background';
import Header from '@/components/Header/Header';
import {
  backgroundClipBallPaths,
  backgroundContainBallPaths,
  headerWithoutSearchPaths,
  withoutHeaderPaths,
} from '@/constants/path/pathMap';
import useThemeStore from '@/stores/themeStore';
import globalStyles from '@/styles/globalStyles';
import { theme } from '@/styles/theme';
import { Global, ThemeProvider } from '@emotion/react';
import { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { s_container, s_content } from './style';

// path에 따른 헤더, 배경 분기처리
const getHeader = (pathName: string) => {
  if (withoutHeaderPaths.includes(pathName.split('/')[1])) return null;
  if (headerWithoutSearchPaths.includes(pathName.split('/')[1])) return <Header search={false} />;
  return <Header search={true} />;
};

const getBackground = (pathName: string) => {
  if (backgroundContainBallPaths.includes(pathName.split('/')[1])) return <Background ball="contain" />;
  if (backgroundClipBallPaths.includes(pathName.split('/')[1])) return <Background ball="clip" />;
  return <Background />;
};

const AppLayout = () => {
  const location = useLocation();
  const isLightMode = useThemeStore((state) => state.lightMode);
  const pathName = location.pathname;

  // pathName이 변경되면 최상단으로 스크롤
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathName]);

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
