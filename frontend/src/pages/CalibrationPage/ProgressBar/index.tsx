import { css } from '@emotion/react';
import { s_div, s_div_bgc } from './style';

interface ProgressBarProps {
  currentIndex: number;
  total: number;
}

const ProgressBar = ({ currentIndex, total }: ProgressBarProps) => {
  const progressPercentage = (currentIndex / total) * 100;

  return (
    <div css={s_div_bgc}>
      <div
        css={[
          s_div,
          css`
            width: ${progressPercentage}%;
            transition: width 0.5s ease; // 부드러운 애니메이션 추가
          `,
        ]}
      ></div>
    </div>
  );
};

export default ProgressBar;
