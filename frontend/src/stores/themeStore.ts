import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeStore {
  lightMode: boolean;
  toggleLightMode: () => void;
}
const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      lightMode: false,
      toggleLightMode: () => set(() => ({ lightMode: !get().lightMode })),
    }),
    { name: 'theme-store' },
  ),
);

export default useThemeStore;
