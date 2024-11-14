import useAuthStore from '@/stores/authStore';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateLayout = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  if (!isLoggedIn) return <Navigate to="signin" />;
  return <Outlet />;
};

export default PrivateLayout;
