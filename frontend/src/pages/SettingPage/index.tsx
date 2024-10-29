import apiClient from '@/api/apiClient';
import ToggleButton from '@/components/Toggle/ToggleButton';
import useSettingStore from '@/stores/settingStore';
import { ReactNode } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { PiVibrate } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';
import SettingComponent from './Components/SettingComponent/SettingComponent';
import { s_componentsContainer, s_titleContainer } from './style';

interface settingComponentsData {
  iconImage: ReactNode;
  text: string;
  rightButton: ReactNode;
  componentClickListener?: (event: React.MouseEvent<HTMLDivElement>) => void;
}
const SettingPage = () => {
  const navigate = useNavigate();
  const { vibration, toggleVibration, visualization, toggleVisualization, blindness, eq } =
    useSettingStore();
  function settingChanged() {
    console.log('asdfasdf');
    apiClient({
      method: 'PUT',
      url: '/settings',
      data: { vibration, visualization, blindness, eq },
    })
      .then((response) => {
        console.log(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const settingComponentsDatas: settingComponentsData[] = [
    {
      iconImage: <PiVibrate />,
      text: '진동',
      rightButton: (
        <ToggleButton
          value={vibration}
          onClickListener={() => {
            toggleVibration();
            settingChanged();
          }}
        />
      ),
    },
    {
      iconImage: <PiVibrate />,
      text: '색상 조정 다시하기',
      rightButton: <IoIosArrowDown />,
      componentClickListener: () => {
        navigate('/calibration');
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
      rightButton: (
        <ToggleButton
          value={visualization}
          onClickListener={() => {
            toggleVisualization();
            settingChanged();
          }}
        />
      ),
    },
    {
      iconImage: <PiVibrate />,
      text: '이퀄라이저',
      rightButton: <IoIosArrowDown />,
      componentClickListener: () => {},
    },
  ];
  return (
    <div>
      <div css={s_titleContainer}>
        <div>설정</div>
      </div>
      <div css={s_componentsContainer}>
        {settingComponentsDatas.map((item, index) => {
          return <SettingComponent key={index} {...item} />;
        })}
      </div>
    </div>
  );
};

export default SettingPage;
