import apiClient from '@/api/apiClient';
import { HttpStatusCode } from 'axios';
import { useEffect, useState } from 'react';
import {
  s_exitButton,
  s_fullScreenWithModal,
  s_img,
  s_modalContainer,
  s_text,
} from './ProfileModal.style';

interface profileModalProps {
  changeModalStatus: () => void;
}

interface userDataI {
  email: string;
  nickname: string;
  profileImage: string;
  signUpDate: string;
}

const ProfileModal = ({ changeModalStatus }: profileModalProps) => {
  const [userData, setUserData] = useState<userDataI>();
  useEffect(() => {
    apiClient({
      method: 'GET',
      url: '/members',
    })
      .then((response) => {
        console.log(response);
        if (response.status === HttpStatusCode.Ok) {
          setUserData(response.data.data);
        } else if (response.data.code === 401) {
          alert('유효하지 않은 JWT 토큰입니다.');
        } else if (response.data.code === 500) {
          alert('내부 서버 오류');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <>
      <div onClick={changeModalStatus} css={s_fullScreenWithModal}></div>
      <div css={s_modalContainer}>
        <button css={s_exitButton} onClick={changeModalStatus}>
          X
        </button>
        <img src={userData?.profileImage} css={s_img} alt="프로필 사진" />
        <div css={s_text}>nickname: {userData?.nickname}</div>
        <div css={s_text}> email: {userData?.email}</div>
        <div css={s_text}>signUpDate: {userData?.signUpDate}</div>
      </div>
    </>
  );
};

export default ProfileModal;
