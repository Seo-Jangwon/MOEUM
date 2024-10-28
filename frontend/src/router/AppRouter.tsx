import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy } from 'react';
import MainPage from '@/pages/MainPage';
import AppLayout from '@/layouts/AppLayout';
import MusicPlayPage from '@/pages/MusicPlayPage';
const ErrorPage = lazy(() => import('@/pages/ErrorPage'));
const SignInPage = lazy(() => import('@/pages/SignInPage'));
const SignUpPage = lazy(() => import('@/pages/SignUpPage'));
const FAQPage = lazy(() => import('@/pages/FAQPage'));
const WelcomePage = lazy(() => import('@/pages/WelcomePage'));
const CalibrationPage = lazy(() => import('@/pages/CalibrationPage'))


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
        path: 'faq',
        element: <FAQPage />,
      },
      {
        path: 'music/:id',
        element: <MusicPlayPage />,
      },
    ],
  },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;
