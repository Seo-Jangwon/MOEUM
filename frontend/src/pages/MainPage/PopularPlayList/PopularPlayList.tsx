import { css } from '@emotion/react';
import { FiCrosshair } from 'react-icons/fi';
import { s_div_header } from '../NewList/style';

interface PlayList {
  title: string;
}

const mokData: { data: PlayList[] } = {
  data: [
    {
      title: '공부할 때 들으면 좋은 음악선',
    },
    {
      title: '공부할 때 들으면 좋은 음악선',
    },
    {
      title: '공부할 때 들으면 좋은 음악선',
    },
    {
      title: '공부할 때 들으면 좋은 음악선',
    },
  ],
};

const PopularPlayList = () => {
  return (
    <>
      <div css={s_div_header}>
        <div
          css={css`
            display: flex;
            gap: 18px;
            font-size: 48px;
            color: #30f751;
            font-weight: 800;
          `}
        >
          <FiCrosshair />
          <h3>인기 플레이리스트</h3>
        </div>
        <button>모두보기</button>
      </div>
      <div
        css={css`
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        `}
      >
        {mokData.data.map((item, index) => (
          <div
            key={index}
            css={css`
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100px;
              background-image: linear-gradient(rgba(0, 0, 255, 0.5), rgba(255, 255, 0, 0.5)),
                url('../image/lala.jpg');
              border-radius: 20px;
            `}
          >
            <h3>{item.title}</h3>
          </div>
        ))}
      </div>
    </>
  );
};

export default PopularPlayList;
