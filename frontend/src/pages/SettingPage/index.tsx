import apiClient from '@/api/apiClient';
import ToggleButton from '@/components/Toggle/ToggleButton';
import useSettingStore from '@/stores/settingStore';
import { ReactNode, useEffect, useState } from 'react';
import { IoIosArrowDropright } from 'react-icons/io';
import { PiVibrate } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';
import SettingComponent from './Components/SettingComponent/SettingComponent';
import { s_componentsContainer, s_titleContainer } from './style';

interface settingComponentsData {
  iconImage: ReactNode;
  text: string;
  rightButton: ReactNode;
}
const SettingPage = () => {
  const navigate = useNavigate();
  const { vibration, toggleVibration, visualization, toggleVisualization, blindness, eq, changeEq } = useSettingStore();
  const [isEqOpen, setIsEqOpen] = useState<boolean>(false);
  const [eqValues, setEqValues] = useState<number[]>([0, 0, 0]);
  function changeEqOpenState() {
    setIsEqOpen((prev) => !prev);
  }
  function settingChanged() {
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
      text: '색상 조정 다시하기',
      rightButton: (
        <IoIosArrowDropright
          style={{ cursor: 'pointer' }}
          onClick={() => {
            navigate('/calibration');
          }}
        />
      ),
    },
    // {
    //   iconImage: <BiEqualizer />,
    //   text: '이퀄라이저',
    //   rightButton: (
    //     <>
    //       <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
    //         {isEqOpen ? <IoIosArrowUp onClick={changeEqOpenState} /> : <IoIosArrowDown onClick={changeEqOpenState} />}
    //       </div>
    //       <div
    //         css={css`
    //           display: ${isEqOpen ? 'flex' : 'none'};
    //           ${s_inputsContainer};
    //         `}
    //       >
    //         <div css={s_inputContainer}>
    //           <div>L &nbsp;</div>
    //           <input
    //             css={s_inputBar}
    //             value={eqValues[0]}
    //             onChange={(e) => {
    //               setEqValues([(eqValues[0] = parseInt(e.target.value)), eqValues[1], eqValues[2]]);
    //               changeEq(eqValues);
    //             }}
    //             onMouseUp={() => {
    //               settingChanged();
    //             }}
    //             type="range"
    //             min={-10}
    //             max={10}
    //             step={1}
    //             name=""
    //             id=""
    //           />
    //         </div>
    //         <div css={s_inputContainer}>
    //           <div>M</div>
    //           <input
    //             css={s_inputBar}
    //             type="range"
    //             value={eqValues[1]}
    //             onChange={(e) => {
    //               setEqValues([eqValues[0], (eqValues[1] = parseInt(e.target.value)), eqValues[2]]);
    //               changeEq(eqValues);
    //             }}
    //             onMouseUp={() => {
    //               settingChanged();
    //             }}
    //             min={-10}
    //             max={10}
    //             step={1}
    //           />
    //         </div>
    //         <div css={s_inputContainer}>
    //           <div>H</div>
    //           <input
    //             css={s_inputBar}
    //             type="range"
    //             value={eqValues[2]}
    //             onChange={(e) => {
    //               setEqValues([eqValues[0], eqValues[1], (eqValues[2] = parseInt(e.target.value))]);
    //               changeEq(eqValues);
    //             }}
    //             onMouseUp={() => {
    //               settingChanged();
    //             }}
    //             min={-10}
    //             max={10}
    //             step={1}
    //             name=""
    //             id=""
    //           />
    //         </div>
    //       </div>
    //     </>
    //   ),
    // },
    {
      iconImage: <PiVibrate />,
      text: '진동',
      rightButton: (
        <ToggleButton
          value={vibration}
          onToggle={() => {
            toggleVibration();
            settingChanged();
          }}
        />
      ),
    },
    {
      iconImage: <PiVibrate />,
      text: '가사 시각화',
      rightButton: (
        <ToggleButton
          value={visualization}
          onToggle={() => {
            toggleVisualization();
            settingChanged();
          }}
        />
      ),
    },
  ];
  useEffect(() => {
    setEqValues([eq[0], eq[1], eq[2]]);
  }, []);
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
