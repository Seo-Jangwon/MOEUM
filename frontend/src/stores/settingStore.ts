import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingStore {
  vibration: boolean;
  visualization: boolean;
  blindness: number;
  eq: number[];
  setSetting: (vibration: boolean, visualization: boolean, blindness: number, eq: number[]) => void;
  toggleVibration: () => void;
  toggleVisualization: () => void;
  changeEq: (eq: number[]) => void;
}

const useSettingStore = create<SettingStore>()(
  persist(
    (set, get) => ({
      vibration: false,
      visualization: false,
      blindness: 0,
      eq: [0, 0, 0],
      setSetting: (vibration, visualization, blindness, eq) => {
        set({ vibration, visualization, blindness, eq });
      },
      toggleVibration: () => set(() => ({ vibration: !get().vibration })),
      toggleVisualization: () => set(() => ({ visualization: !get().visualization })),
      changeEq: (eq: number[]) => {
        set({ eq });
      },
    }),
    { name: 'setting-store' },
  ),
);

export default useSettingStore;
