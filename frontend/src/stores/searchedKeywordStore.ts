import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SearchedKeywordStore {
  searches: string[];
  addSearchKeyword: (searchKeyword: string) => void;
  removeSearchKeyword: (idx: number) => void;
  removeAllSearchKeyword: () => void;
}

const useSearchedKeywordStore = create<SearchedKeywordStore>()(
  persist(
    (set) => ({
      searches: [],
      addSearchKeyword: (searchKeyword) => {
        set((state) => ({
          searches: [searchKeyword, ...state.searches.filter((item) => item !== searchKeyword)],
        }));
      },
      removeSearchKeyword: (idx) => {
        set((state) => ({
          searches: state.searches.filter((_, i) => i !== idx),
        }));
      },
      removeAllSearchKeyword: () => {
        set(() => ({
          searches: [],
        }));
      },
    }),
    { name: 'search-history' },
  ),
);

export default useSearchedKeywordStore;
