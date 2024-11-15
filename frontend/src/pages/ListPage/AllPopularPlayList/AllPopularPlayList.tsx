import apiClient from '@/api/apiClient';
import { s_container } from '@/pages/MainPage/style';
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';

interface ListPageProps {
  title: string;
}


interface Music {
  id: number;
  name: string;
  image: string;
}


const AllPopularPlayList = ({ title }: ListPageProps) => {
  const [playList, setPlayList] = useState<Music[]>([]);

  useEffect(() => {
    apiClient({
      method: 'GET',
      url: '/musics/popular/playlist',
    })
      .then((res) => {
        console.log(res);
        if (res.data.code === 200) {
          console.log(res.data.data);
          setPlayList(res.data.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div css={s_container}>
      {/* 전체 박스 */}
      <div>
        {/* {이름} 모두보기 div */}
        <div
          css={css`
            font-size: 36px;
            font-weight: 700;
            color: #30f751;
            padding: 16px;
            @media (max-width: 768px) {
              font-size: 24px;
            }
          `}
        >
          <h3>인기 {title} 전체보기</h3>
        </div>
        {/* 음악 데이터 박스*/}
        <div
          css={css`
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 10px;
          `}
        >
          {playList.map((item, index) => (
            <div>
              <button
                key={index}
                css={css`
                  background: transparent;
                  border: 0;
                  position: relative;
                  overflow: hidden;
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
                  src={item.image}
                  alt="라라"
                  css={css`
                    width: 100%;
                    border-radius: 20px;
                    display: block;
                  `}
                />
              </button>
              <p
                css={css`
                  font-size: 24px;
                  font-weight: 700;
                  color: white;
                  text-align: center;
                `}
              >
                {item.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllPopularPlayList;
