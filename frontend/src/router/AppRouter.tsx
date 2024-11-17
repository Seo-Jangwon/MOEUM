import AppLayout from '@/layouts/AppLayout';
import PrivateLayout from '@/layouts/PrivateLayout';
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
        path: 'signin',
        element: <SignInPage />,
      },
      {
        path: 'signup',
        element: <SignUpPage />,
      },
      {
        path: 'faq',
        element: <FAQPage />,
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
        path: 'playlist/:id',
        element: <DetailPage variant="playlist" />,
      },
      {
        path: 'list/:id',
        element: <ListPage />,
      },
      {
        element: <PrivateLayout />,
        children: [
          {
            path: 'calibration',
            element: <CalibrationPage />,
          },
          {
            path: 'record',
            element: <RecentRecordPage />,
          },
          {
            path: 'music',
            element: <MusicPlayPage />,
          },
          {
            path: 'settings',
            element: <SettingPage />,
          },
          {
            path: 'mystorage',
            element: <MyStoragePage />,
          },
          {
            path: 'profile',
            element: <ProfilePage />,
          },
        ],
      },
      {
        path: 'search',
        children: [
          { index: true, element: <SearchPage /> },
          {
            path: 'music',
            element: <SearchMorePage variant="music" />,
          },
          {
            path: 'album',
            element: <SearchMorePage variant="album" />,
          },
          {
            path: 'artist',
            element: <SearchMorePage variant="artist" />,
          },
          {
            path: 'playlist',
            element: <SearchMorePage variant="playlist" />,
          },
        ],
      },
    ],
  },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;
