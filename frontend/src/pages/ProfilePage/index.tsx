import { ReactNode } from 'react';
import { FaPlus } from 'react-icons/fa6';
import { ImCross } from 'react-icons/im';
import { IoIosArrowDropright } from 'react-icons/io';
import { PiVibrate } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';
import SettingComponent from '../SettingPage/Components/SettingComponent/SettingComponent';
import logo from '../SignUpPage/image/logo.png';
import { s_componentsContainer, s_titleContainer } from './style';

interface settingComponentsData {
  iconImage: ReactNode;
  text: string;
  rightButton: ReactNode;
}
const ProfilePage = () => {
  const navigate = useNavigate();

  const settingComponentsDatas: settingComponentsData[] = [
    {
      iconImage: <PiVibrate />,
      text: '닉네임 변경',
      rightButton: <FaPlus />,
    },
    {
      iconImage: <PiVibrate />,
      text: '프로필 사진 변경',
      rightButton: <FaPlus />,
    },
    {
      iconImage: <PiVibrate />,
      text: '비밀번호 변경',
      rightButton: <IoIosArrowDropright />,
    },
    {
      iconImage: <PiVibrate />,
      text: '회원 탈퇴',
      rightButton: <ImCross />,
    },
  ];
  return (
    <div>
      <div css={s_titleContainer}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src={logo} css={{ backgroundColor: 'gray', opacity: 0.7 }} />
          &nbsp; 프로필
        </div>
      </div>
      <div css={s_componentsContainer}>
        {settingComponentsDatas.map((item, index) => {
          return <SettingComponent key={index} {...item} />;
        })}
      </div>
    </div>
  );
};

export default ProfilePage;
