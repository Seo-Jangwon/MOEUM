import Background from '@/components/Background/Background';
import Header from '@/components/Header/Header';
import {
  backgroundContainBallPaths,
  headerWithoutSearchPaths,
  WithoutHeaderPaths,
} from '@/constants/path/pathMap';
import useThemeStore from '@/stores/themeStore';
import globalStyles from '@/styles/globalStyles';
import { theme } from '@/styles/theme';
import { Global, ThemeProvider } from '@emotion/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

const getHeader = (pathName: string) => {
  if (WithoutHeaderPaths.includes(pathName.split('/')[1])) return null;
  if (headerWithoutSearchPaths.includes(pathName.split('/')[1])) return <Header search={false} />;
  return <Header search={true} />;
};

const getBackground = (pathName: string) => {
  if (backgroundContainBallPaths.includes(pathName.split('/')[1]))
    return <Background ball="contain" />;
  return <Background />;
};

const AppLayout = () => {
  const location = useLocation();
  const isLightMode = useThemeStore((state) => state.lightMode);
  const pathName = location.pathname;
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 0,
      },
    },
  });
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme(isLightMode)}>
        <Global styles={globalStyles} />
        <div css={{ height: '100%', position: 'relative' }}>
          {getBackground(pathName)}
          {getHeader(pathName)}
          <div
            css={{
              position: 'absolute',
              top: '80px',
              left: '0',
              width: '100%',
              height: 'calc(100vh - 80px)',
              minHeight: '600px',
              zIndex: -1,
            }}
          >
            <Suspense>
              <Outlet />
            </Suspense>
          </div>
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default AppLayout;
