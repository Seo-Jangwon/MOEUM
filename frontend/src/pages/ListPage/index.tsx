import lala from '@/assets/lalaticon/lala4.png';
import { css } from '@emotion/react';
import { useParams } from 'react-router-dom';
import { s_container } from '../MainPage/style';

interface Music {
  title: string;
  image: string;
}

const mokData: { music: Music[] } = {
  music: [
    { title: '라라랜드', image: 'dfd.jpg' },
    { title: '라라랜드', image: 'dfd.jpg' },
    { title: '라라랜드', image: 'dfd.jpg' },
    { title: '라라랜드', image: 'dfd.jpg' },
    { title: '라라랜드', image: 'dfd.jpg' },
    { title: '라라랜드', image: 'dfd.jpg' },
    { title: '라라랜드', image: 'dfd.jpg' },
    { title: '라라랜드', image: 'dfd.jpg' },
    { title: '라라랜드', image: 'dfd.jpg' },
    { title: '라라랜드', image: 'dfd.jpg' },
    { title: '라라랜드', image: 'dfd.jpg' },
    { title: '라라랜드', image: 'dfd.jpg' },
    { title: '라라랜드', image: 'dfd.jpg' },
    { title: '라라랜드', image: 'dfd.jpg' },
  ],
};

const ListPage = () => {
  const { id } = useParams();
  return (
    <div css={s_container}>
      {/* 전체 박스 */}
      <div>
        {/* {이름} 모두보기 div */}
        <div
          css={css`
            font-size: 36px;
            font-weight: 700;
            color: white;
            padding: 16px;
          `}
        >
          <h3>{id} 전체 보기</h3>
        </div>
        {/* 음악 데이터 박스*/}
        <div
          css={css`
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 10px;
          `}
        >
          {mokData.music.map((item, index) => (
            <button
              key={index}
              css={css`
                background: transparent;
                border: 0;
                position: relative;
                overflow: hidden;
                cursor: pointer;

                :hover::before {
                  content: '';
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                  background-color: rgba(0, 0, 0, 0.5);
                  border-radius: 20px;
                }

                :hover > p {
                  opacity: 1;
                  transition: opacity 0.3s;
                }
              `}
            >
              <img
                src={lala}
                alt="라라"
                css={css`
                  width: 100%;
                  border-radius: 20px;
                  display: block;
                `}
              />
              <p
                css={css`
                  font-size: 24px;
                  font-weight: 700;
                  color: white;
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  opacity: 0;
                  z-index: 1;
                  transition: opacity 0.3s;
                `}
              >
                {item.title}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListPage;
