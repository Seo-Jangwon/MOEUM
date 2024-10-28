import { ReactNode, useRef } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { PiVibrate } from 'react-icons/pi';
import SettingComponent from './Components/SettingComponent/SettingComponent';
import { useNavigate } from 'react-router-dom';
import { s_componentsContainer, s_titleContainer } from './style';

interface settingComponentsData {
  iconImage: ReactNode;
  text: string;
  rightButton: ReactNode;
  componentClickListener?: (event: React.MouseEvent<HTMLDivElement>) => void;
}
const SettingPage = () => {
  const navigate = useNavigate();
  const settingComponentsDatas = useRef<settingComponentsData[]>([
    {
      iconImage: <PiVibrate />,
      text: '진동',
      rightButton: <IoIosArrowDown />,
    },
    {
      iconImage: <PiVibrate />,
      text: '색상 조정 다시하기',
      rightButton: <IoIosArrowDown />,
      componentClickListener: () => {
        navigate('/');
      },
    },
    {
      iconImage: <PiVibrate />,
      text: '색각 보조',
      rightButton: <IoIosArrowDown />,
    },
    {
      iconImage: <PiVibrate />,
      text: '가사 시각화',
      rightButton: <IoIosArrowDown />,
    },
    {
      iconImage: <PiVibrate />,
      text: '이퀄라이저',
      rightButton: <IoIosArrowDown />,
      componentClickListener: () => {},
    },
  ]);
  return (
    <div>
      <div css={s_titleContainer}>
        <div>설정</div>
      </div>
      <div css={s_componentsContainer}>
        {settingComponentsDatas.current.map((item, index) => {
          return (
            <SettingComponent
              iconImage={item.iconImage}
              text={item.text}
              rightButton={item.rightButton}
              componentClickListener={item.componentClickListener}
              key={index}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SettingPage;
