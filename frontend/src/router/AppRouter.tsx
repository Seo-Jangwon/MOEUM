import AppLayout from '@/layouts/AppLayout';
import MusicPlayPage from '@/pages/MusicPlayPage';
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
        path: 'record',
        element: <RecentRecordPage />,
      },
      {
        path: 'faq',
        element: <FAQPage />,
      },
      {
        path: 'music/:id',
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
        path: 'profile',
        element: <ProfilePage />,
      },
      {
        path: 'search',
        element: <SearchPage />,
      },
    ],
  },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;
