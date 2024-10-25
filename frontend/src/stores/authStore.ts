import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthStore {
  accessToken: string | undefined;
  setAccesstoken: (token: string) => void;
}

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      accessToken: undefined,
      setAccesstoken: (token) => set({ accessToken: token }),
    }),
    { name: 'auth-store' },
  ),
);

export default useAuthStore;
