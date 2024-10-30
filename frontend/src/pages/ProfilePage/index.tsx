import Modal from '@/components/Modal/Modal';
import { ReactNode, useRef, useState } from 'react';
import { FaPlus } from 'react-icons/fa6';
import { ImCross } from 'react-icons/im';
import { IoIosArrowDropright } from 'react-icons/io';
import { PiVibrate } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';
import SettingComponent from '../SettingPage/Components/SettingComponent/SettingComponent';
import logo from '../SignUpPage/image/logo.png';
import { s_componentsContainer, s_titleContainer } from './style';
import apiClient from '@/api/apiClient';

interface profileComponentsData {
  iconImage: ReactNode;
  text: string;
  rightButton: ReactNode;
}

interface editModalComponentsData {
  title: string;
  modalBody: ReactNode;
  positiveButtonClickListener: () => void;
  negativeButtonClickListener: () => void;
}

const ProfilePage = () => {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const modalDataIdx = useRef<number>(0);
  const [submitData, setSubmitData] = useState<string>('');
  const [submitImage, setSubmitImage] = useState<File | null>(null);

  function openModalAndChangeIdx(idx: number) {
    modalDataIdx.current = idx;
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }
  function changeSubmitData(str: string) {
    setSubmitData(str);
  }

  const profileComponentsDatas: profileComponentsData[] = [
    {
      iconImage: <PiVibrate />,
      text: '닉네임 변경',
      rightButton: (
        <FaPlus
          onClick={() => {
            openModalAndChangeIdx(0);
          }}
        />
      ),
    },
    {
      iconImage: <PiVibrate />,
      text: '프로필 사진 변경',
      rightButton: (
        <FaPlus
          onClick={() => {
            openModalAndChangeIdx(1);
          }}
        />
      ),
    },
    {
      iconImage: <PiVibrate />,
      text: '비밀번호 변경',
      rightButton: (
        <IoIosArrowDropright
          onClick={() => {
            openModalAndChangeIdx(2);
          }}
        />
      ),
    },
    {
      iconImage: <PiVibrate />,
      text: '회원 탈퇴',
      rightButton: (
        <ImCross
          onClick={() => {
            openModalAndChangeIdx(3);
          }}
        />
      ),
    },
  ];

  function changeNickname() {
    apiClient({
      method: 'PUT',
      url: '/members/edit/nickname',
      data: { nickname: submitData },
    })
      .then((response) => {
        if (response.data.code === 200) {
          alert('닉네임 변경이 완료되었습니다.');
        } else {
          alert('오류가 발생하였습니다.');
        }
      })
      .catch((err) => {
        alert('오류가 발생하였습니다. 다시 시도해 주십시오.');
        console.log(err);
      })
      .finally(() => {
        navigate(0);
      });
    setSubmitImage(null);
  }

  function changeProfileImage() {
    if (submitImage === null) {
      alert('변경할 이미지를 등록해주세요.');
      return;
    }
    if (!submitImage.type.startsWith('image/')) {
      alert('올바른 파일을 등록해주세요');
      return;
    }
    const formData = new FormData();
    formData.append('profileImage', submitImage);
    apiClient({
      method: 'PUT',
      headers: { 'Content-Type': 'multipart/form-data' },
      url: '/members/edit/profileimg',
      data: formData,
    })
      .then((response) => {
        if (response.data.code === 200) {
          alert('프로필 사진 변경이 되었습니다.');
        } else {
          alert('오류가 발생하였습니다.');
        }
      })
      .catch((err) => {
        alert('오류가 발생하였습니다. 다시 시도해 주십시오.');
        console.log(err);
      })
      .finally(() => {
        navigate(0);
      });
    changeSubmitData('');
  }

  function deleteUser() {
    apiClient({
      method: 'PUT',
      url: '/members/delete',
      data: { email: submitData },
    })
      .then((response) => {
        if (response.data.code === 200) {
          alert('회원 탈퇴가 완료되었습니다');
          //저스탠드 데이터 초기화 필요
          navigate('/');
        } else {
          alert('오류가 발생하였습니다.');
        }
      })
      .catch((err) => {
        alert('오류가 발생하였습니다. 다시 시도해 주십시오.');
        console.log(err);
      })
      .finally(() => {
        navigate(0);
      });
    changeSubmitData('');
  }

  const editModalComponentsData: editModalComponentsData[] = [
    {
      title: '닉네임 변경',
      modalBody: (
        <>
          <input
            type="text"
            maxLength={10}
            value={submitData}
            onChange={(e) => {
              changeSubmitData(e.target.value);
            }}
          />
        </>
      ),
      positiveButtonClickListener: changeNickname,
      negativeButtonClickListener: closeModal,
    },
    {
      title: '프로필 사진 변경',
      modalBody: (
        <>
          <input
            type="file"
            accept="image/*"
            maxLength={10}
            onSubmit={(e) => {
              e.preventDefault();
            }}
            onChange={(e) => {
              e.preventDefault();
              if (e.target.files) {
                setSubmitImage(e.target.files[0]);
              }
            }}
          />
        </>
      ),
      positiveButtonClickListener: changeProfileImage,
      negativeButtonClickListener: closeModal,
    },
    {
      title: '비밀번호 변경',
      modalBody: <div>asdf</div>,
      positiveButtonClickListener: () => {},
      negativeButtonClickListener: closeModal,
    },
    {
      title: '회원 탈퇴',
      modalBody: (
        <>
          <div style={{ marginBottom: '15px', fontSize: '20px', lineHeight: 1.6 }}>
            탈퇴하시려면 <br />
            이메일을 입력해주세요.
          </div>
          <input
            type="text"
            maxLength={20}
            value={submitData}
            onChange={(e) => {
              changeSubmitData(e.target.value);
            }}
          />
        </>
      ),
      positiveButtonClickListener: deleteUser,
      negativeButtonClickListener: closeModal,
    },
  ];
  return (
    <div>
      <div css={s_titleContainer}>
        {isModalOpen ? <Modal {...editModalComponentsData[modalDataIdx.current]} /> : null}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div>
            <img src={logo} css={{ backgroundColor: 'gray', opacity: 0.7 }} />
          </div>
          &nbsp;
          <p>닉네임</p>
        </div>
      </div>
      <div css={s_componentsContainer}>
        <div>이메일: 이메일</div>
        <div>가입일: 가입일</div>
        {profileComponentsDatas.map((item, index) => {
          return <SettingComponent key={index} {...item} />;
        })}
      </div>
    </div>
  );
};

export default ProfilePage;
