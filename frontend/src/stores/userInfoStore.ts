import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserInfoStore {
  nickname: string;
  registeredDate: string;
  profileImage: string;
  email: string;
  setNickname: (name: string) => void;
  setRegisteredDate: (date: string) => void;
  setProfileImage: (imageUrl: string) => void;
  setEmail: (email: string) => void;
  setUserInfo: (name: string, date: string, imageUrl: string, email: string) => void;
  signOutInUserInfo: () => void;
}

const useUserInfoStore = create<UserInfoStore>()(
  persist(
    (set) => ({
      nickname: '',
      registeredDate: '',
      profileImage: '',
      email: '',
      setNickname: (name) => {
        set({ nickname: name });
      },
      setRegisteredDate: (date) => {
        set({ registeredDate: date });
      },
      setProfileImage: (imageUrl) => {
        set({ profileImage: imageUrl });
      },
      setEmail: (email) => {
        set({ email });
      },
      setUserInfo: (name, date, imageUrl, email) => {
        set({ nickname: name, registeredDate: date, profileImage: imageUrl, email });
      },
      signOutInUserInfo: () => {
        set({ nickname: '', registeredDate: '', profileImage: '', email: '' });
      },
    }),
    { name: 'userinfo-store' },
  ),
);

export default useUserInfoStore;
