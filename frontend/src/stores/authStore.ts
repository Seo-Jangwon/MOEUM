import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import useUserInfoStore from './userInfoStore';

interface AuthStore {
  isLoggedIn: boolean;
  accessToken: string;
  setAccessToken: (token: string) => void;
  signOut: () => void;
}

const resetUserInfo = useUserInfoStore.getState().resetUserInfo;

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      accessToken: '',
      setAccessToken: (token) => {
        set({ accessToken: token, isLoggedIn: true });
      },
      signOut: () => {
        set({ accessToken: '', isLoggedIn: false });
        resetUserInfo();
        window.location.href = '/';
      },
    }),
    { name: 'auth-store' },
  ),
);

export default useAuthStore;
