import AppLayout from '@/layouts/AppLayout';
import MusicPlayPage from '@/pages/MusicPlayPage';
import SparkleEffect from '@/pages/test/test';
import { lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
const DetailPage = lazy(() => import('@/pages/DetailPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const SettingPage = lazy(() => import('@/pages/SettingPage'));
const ErrorPage = lazy(() => import('@/pages/ErrorPage'));
const SignInPage = lazy(() => import('@/pages/SignInPage'));
const SignUpPage = lazy(() => import('@/pages/SignUpPage'));
const FAQPage = lazy(() => import('@/pages/FAQPage'));
const WelcomePage = lazy(() => import('@/pages/WelcomePage'));
const CalibrationPage = lazy(() => import('@/pages/CalibrationPage'));
const MainPage = lazy(() => import('@/pages/MainPage'));
const SearchPage = lazy(() => import('@/pages/SearchPage'));
const RecentRecordPage = lazy(() => import('@/pages/RecordPage'));
const ListPage = lazy(() => import('@/pages/ListPage'));
const SearchMorePage = lazy(() => import('@/pages/SearchMorePage'));
const MyStoragePage = lazy(() => import('@/pages/MyStoragePage'));
const SupportPage = lazy(() => import('@/pages/SupportPage'));
const DetailPlayList = lazy(() => import('@/pages/DetailPlayListpage'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <MainPage />,
      },
      {
        path: 'welcome',
        element: <WelcomePage />,
      },
      { path: 'test', element: <SparkleEffect /> },
      {
        path: 'calibration',
        element: <CalibrationPage />,
      },
      {
        path: 'signin',
        element: <SignInPage />,
      },
      {
        path: 'signup',
        element: <SignUpPage />,
      },
      {
        path: 'support',
        element: <SupportPage />,
      },
      {
        path: 'record',
        element: <RecentRecordPage />,
      },
      {
        path: 'faq',
        element: <FAQPage />,
      },
      {
        path: 'music',
        element: <MusicPlayPage />,
      },
      {
        path: 'album/:id',
        element: <DetailPage variant="album" />,
      },
      {
        path: 'artist/:id',
        element: <DetailPage variant="artist" />,
      },
      {
        path: 'settings',
        element: <SettingPage />,
      },
      {
        path: 'myStorage',
        element: <MyStoragePage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
      {
        path: 'search',
        element: <SearchPage />,
      },
      {
        path: 'search/music',
        element: <SearchMorePage variant="music" />,
      },
      {
        path: 'search/album',
        element: <SearchMorePage variant="album" />,
      },
      {
        path: 'search/artist',
        element: <SearchMorePage variant="artist" />,
      },
      {
        path: 'search/playlist',
        element: <SearchMorePage variant="playlist" />,
      },
      {
        path: 'list/:id',
        element: <ListPage />,
      },
      {
        path: 'playlist/:id',
        element: <DetailPlayList />,
      },
    ],
  },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;
