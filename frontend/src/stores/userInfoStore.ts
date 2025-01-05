import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserInfo {
  nickname?: string;
  registeredDate?: string;
  profileImage?: string;
  email?: string;
}
interface UserInfoStore {
  userInfo: UserInfo;
  setUserInfo: (prev: React.SetStateAction<UserInfo> | UserInfo) => void;
  resetUserInfo: () => void;
}

const initialUserInfo = {
  nickname: '',
  registeredDate: '',
  profileImage: '',
  email: '',
};

const useUserInfoStore = create<UserInfoStore>()(
  persist(
    (set) => ({
      userInfo: initialUserInfo,

      setUserInfo: (prev) =>
        prev instanceof Function ? set((state) => ({ userInfo: prev(state.userInfo) })) : set({ userInfo: prev }),

      resetUserInfo: () => {
        set({ userInfo: initialUserInfo });
      },
    }),
    { name: 'userinfo-store' },
  ),
);

export default useUserInfoStore;
