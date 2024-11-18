import apiClient from '@/api/apiClient';
import DotDotDot from '@/components/DotDotDot/DotDotDot';
import { s_container } from '@/pages/MainPage/style';
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { FaRegHeart } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  const handleLike = (id: number) => {
    apiClient({
      method: 'POST',
      url: '/musics/music/like',
      data: { id },
    })
      .then(() => {})
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    apiClient({
      method: 'GET',
      url: '/musics/popular/playlist',
    })
      .then((res) => {
        if (res.data.code === 200) {
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
            <div key={index}>
              <button
                css={css`
                  background: transparent;
                  border: 0;
                  position: relative;
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
                onClick={() => {
                  navigate(`/playlist/${item.id}`);
                }}
              >
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  css={css`
                    position: absolute;
                    z-index: 122;

                    right: 10px;
                    bottom: 10px;
                    :hover {
                      background-color: #888;
                      border-radius: 100%;
                    }
                    @media (max-width: 768px) {
                      right: 5px;
                      bottom: 50px;
                    }
                  `}
                >
                  <DotDotDot
                    data={[
                      {
                        iconImage: <FaRegHeart />,
                        text: '좋아요',
                        clickHandler: () => {
                          handleLike(item.id);
                        },
                        size: 20,
                      },
                    ]}
                  />
                </div>
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
                  font-size: 18px;
                  font-weight: 700;
                  color: white;
                  text-align: center;
                  display: -webkit-box;
                  -webkit-line-clamp: 1;
                  -webkit-box-orient: vertical;
                  overflow: hidden;
                  text-overflow: ellipsis;
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
