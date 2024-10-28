import { css } from '@emotion/react';
import SelectColor from './SelectColor';
import { useState, useEffect } from 'react';
import ProgressBar from './ProgressBar';
import { s_content, s_titlebox } from './style';
import { useNavigate } from 'react-router-dom';

const mokData = [
  {
    q: '고요하다',
    color: [
      ['#2F58AF', '#0E317B'],
      ['#62AF2F', '#0E7B34'],
    ],
  },
  {
    q: '활발하다',
    color: [
      ['blue', 'white'],
      ['yellow', 'white'],
    ],
  },
  {
    q: '편안하다',
    color: [
      ['purple', 'white'],
      ['orange', 'white'],
    ],
  },
];

const Calibration = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedColors, setSelectedColors] = useState<number[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentIndex >= mokData.length) {
      const timer = setTimeout(() => {
        navigate('/');
      }, 2000); 

      return () => clearTimeout(timer);
    }
  }, [currentIndex, navigate]);

  const handleNext = (selectedIndex: number) => {
    setSelectedColors((prevColors) => [...prevColors, selectedIndex]);

    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  return (
    <main css={s_content}>
      <div>
        <p
          css={css`
            color: #444;
          `}
        >
          모음과 조금 더 친해져봐요!
        </p>
        <p
          css={(theme) => css`
            color: ${theme.colors.lightgray};
          `}
        >
          이 단어를 보면 어떤 단어가 떠오르나요?
        </p>
        {currentIndex < mokData.length ? (
          <div css={s_titlebox}>
            <SelectColor
              question={mokData[currentIndex].q}
              colors={mokData[currentIndex].color}
              onSend={handleNext}
            />
          </div>
        ) : ( <div css={css`
          font-size: 64px;
          font-weight: 700;
          color: white;
        `}>
          완료하였습니다.
        </div>)}
        <div>
          <ProgressBar currentIndex={currentIndex} total={mokData.length} />
        </div>
      </div>
    </main>
  );
};

export default Calibration;
