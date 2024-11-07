import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthStore {
  isLoggedIn: boolean;
  accessToken: string;
  setAccesstoken: (token: string) => void;
}

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      accessToken: '',
      setAccesstoken: (token) => {
        set({ accessToken: token, isLoggedIn: true });
      },
    }),
    { name: 'auth-store' },
  ),
);

export default useAuthStore;
