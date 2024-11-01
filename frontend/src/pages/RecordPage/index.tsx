import { css } from '@emotion/react';
import { useState } from 'react';
import { VscHeart } from 'react-icons/vsc';
import lala from '../MainPage/image/lala.jpg';
import { s_container, s_div_title, s_p } from './style';

interface Record {
  title: string;
  image: string;
  artist: string;
  time: string;
  heart: boolean;
}

const mokData: { music: Record[] } = {
  music: [
    {
      title: '라라',
      image: 'lala.jpg',
      artist: 'LALA',
      time: '4:10',
      heart: true,
    },
    {
      title: '라라',
      image: 'lala.jpg',
      artist: 'LALA',
      time: '4:10',
      heart: false,
    },
    {
      title: '라라',
      image: 'lala.jpg',
      artist: 'LALA',
      time: '4:10',
      heart: true,
    },
  ],
};

const RecordPage = () => {
  const [isHeart, setIsHeart] = useState<boolean>(false);

  const handleHeart = () => {
    setIsHeart(!isHeart);
  };
  return (
    // 전체 레이아웃
    <div css={s_container}>
      {/* 최근 감상 기록 텍스트 */}
      <div css={s_div_title}>
        <h3>최근 감상 기록</h3>
      </div>
      {/* 최근 음악 데이터 */}
      <div
        css={css`
          margin-top: 20px;
        `}
      >
        {mokData.music.map((item, index) => (
          <div
            key={index}
            css={css`
              display: flex;
              justify-content: space-between;
              border-bottom: 1px solid white;
              align-items: center;
              :hover > div > div > img {
                filter: brightness(50%);
                transition: 0.3s;
              }
            `}
          >
            {/* 이미지 */}
            <div
              css={css`
                display: flex;
                align-items: center;
              `}
            >
              <div
                css={css`
                  gap: 10px;
                  width: 20%;
                `}
              >
                <img
                  src={lala}
                  alt="라라"
                  css={css`
                    width: 80%;
                    height: 80%;
                    padding: 2px;
                  `}
                />
              </div>
              <h4
                css={css`
                  font-size: 24px;
                  color: white;
                  font-weight: 700;
                `}
              >
                {item.title}
              </h4>
            </div>
            {/* 제목, 아티스트  */}
            <p css={s_p}>{item.artist}</p>
            { <VscHeart onClick={handleHeart} />}
            <p css={s_p}>{item.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecordPage;
