import { css } from '@emotion/react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from './ProgressBar';
import SelectColor from './SelectColor';
import { s_content, s_titlebox } from './style';

const mokData = [
  {
    q: '즐거움',
    color: [
      ['#fcea1c', '#ffff61'],
      ['#fc9f1c', '#fbc170'],
    ],
  },
  {
    q: '슬픔',
    color: [
      ['#162d6e', '#354673'],
      ['#6e134b', '#652e50'],
    ],
  },
  {
    q: '고요함',
    color: [
      ['#e8e8e8', '#cfcfcf'],
      ['#454545', '#6c6b6b'],
    ],
  },
  {
    q: '요란함',
    color: [
      ['#00fbff', '#00fbff'],
      ['#ff3b29', '#ff1500'],
    ],
  },
  {
    q: '놀람',
    color: [
      ['#5fa9de', '#7fb3d7'],
      ['#41a667', '#60a87c'],
    ],
  },
  {
    q: '차분함',
    color: [
      ['#434999', '#5a5e96'],
      ['#1421cc', '#5960c5'],
    ],
  },
  {
    q: '분노',
    color: [
      ['#ad0000', '#ff0000'],
      ['#c95106', '#ff6708'],
    ],
  },
  {
    q: '사랑',
    color: [
      ['#e34fdc', '#de76d8'],
      ['#b50d53', '#ff2f86'],
    ],
  },
];

const Calibration = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const selectedColors = useRef<number[]>([]);
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
    selectedColors.current.push(selectedIndex);
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
        ) : (
          <div style={{color: 'white'}}>완료하였습니다.</div>
        )}
        <div>
          <ProgressBar currentIndex={currentIndex} total={mokData.length} />
        </div>
      </div>
    </main>
  );
};

export default Calibration;
