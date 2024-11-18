import apiClient from '@/api/apiClient';
import DotDotDot from '@/components/DotDotDot/DotDotDot';
import { s_div_header } from '@/pages/MainPage/NewList/style';
import {
  s_div_data,
  s_div_h3,
  s_h5_title,
  s_p_artist,
  s_popular_box,
  s_popular_container,
} from '@/pages/MainPage/PopularList/style';
import { s_container } from '@/pages/MainPage/style';
import Modal from '@/pages/RecordPage/Modal/Modal';
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { FaRegHeart } from 'react-icons/fa6';
import { PiPlaylist } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';

interface ListPageProps {
  title: string;
}

interface Artist {
  id: number;
  name: string;
}

interface Music {
  id: number;
  name: string;
  image: string;
  artists: Artist[];
}
const AllPopularList = ({ title }: ListPageProps) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [popularList, setPopularList] = useState<Music[]>([]);
  const [musicId, setMusicId] = useState<number>(0);

  const openModal = (id: number) => {
    setIsModalOpen(true);
    setMusicId(id);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleLike = (id: number) => {
    apiClient({
      method: 'POST',
      url: '/musics/music/like',
      data: { id },
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    apiClient({
      method: 'GET',
      url: '/musics/popular',
    })
      .then((res) => {
        console.log(res);
        if (res.data.code === 200) {
          setPopularList(res.data.data);
        }
      })
      .catch((err) => {
        alert('서비스 점검 중입니다.');
        console.log(err);
      });
  }, []);

  return (
    <div css={s_container}>
      <div
        css={css`
          display: flex;
          flex-direction: column;
          gap: 20px;
        `}
      >
        <div css={s_div_header}>
          <div css={s_div_h3}>
            <h3>{title} 전체보기</h3>
          </div>
        </div>
        <div css={s_popular_container}>
          {popularList.map((item, index) => (
            <div key={index} css={s_popular_box} onClick={() => navigate(`/music?id=${item.id}`)}>
              <div
                css={css`
                  border-radius: 100%;
                  overflow: hidden;
                  margin: 2%;
                  height: 73.5%;
                  aspect-ratio: 1 / 1;
                `}
              >
                <img
                  src={item.image}
                  alt="라라"
                  css={css`
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                  `}
                />
              </div>
              <div css={s_div_data}>
                <div css={css`
                `}>
                  <h5 css={s_h5_title}>{item.name} </h5>
                  {item.artists.map((item, index) => (
                    <p key={index} css={s_p_artist}>{item.name}</p>
                  ))}
                </div>
              </div>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                }}
                css={css`
                  z-index: 1;
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
                    {
                      iconImage: <PiPlaylist />,
                      text: '플레이리스트 추가',
                      clickHandler: () => {
                        openModal(item.id);
                      },
                      size: 20,
                    },
                  ]}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal} musicId={musicId} />
    </div>
  );
};

export default AllPopularList;
