import apiClient from '@/api/apiClient';
import DotDotDot from '@/components/DotDotDot/DotDotDot';
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { FaPlay, FaRegHeart } from 'react-icons/fa6';
import { FiActivity } from 'react-icons/fi';
import { PiPlaylist } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';
import { s_button_all, s_div_header } from '../NewList/style';
import { s_div_data, s_div_h3, s_h5_title, s_p_artist, s_popular_box, s_popular_container } from './style';
import Modal from '@/pages/RecordPage/Modal/Modal';

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

const PopularList = () => {
  const navigate = useNavigate();
  const [popularList, setPopularList] = useState<Music[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [musicId, setMusicId] = useState<number>(0)


  const openModal = (id: number) => {
    setIsModalOpen(true);
    setMusicId(id)

  };

  // 모달 닫기 함수
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const clickHandler = (index: number) => {
    navigate(`/music?id=${index}`);
  };
//
  // 인기곡 30가지
  useEffect(() => {
    apiClient({
      method: 'GET',
      url: '/musics/popular',
    })
      .then((res) => {
        if (res.data.code === 200) {
          setPopularList(res.data.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // 좋아요 설정
  const handleLike = (id: number) => {
    apiClient({
      method: 'POST',
      url: '/musics/music/like',
      data: { id },
    })
      .then((res) => {
        // console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <div css={s_div_header}>
        <div css={s_div_h3}>
          <FiActivity />
          <h3>지금 가장 HOT한 30</h3>
        </div>
        <button css={s_button_all} onClick={() => navigate('list/Popular')}>
          더 보기
        </button>
      </div>
      <div css={s_popular_container}>
        {popularList.slice(0, 6).map((item, index) => (
          <div key={index} css={s_popular_box} onClick={() => clickHandler(index)}>
            <div
              css={css`
                margin: 2%;
                height: 70%;
                aspect-ratio: 1 / 1;
              `}
            >
              <div style={{ position: 'relative' }}>
                <img
                  src={item.image}
                  alt="라라"
                  css={css`
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: 100%;
                  `}
                />
                <FaPlay
                  className="icon"
                  css={css`
                    position: absolute;
                    color: white;
                    transform: translate(-50%, -50%);
                    opacity: 0;
                    left: 50%;
                    top: 50%;
                    :hover {
                      scale: 1.1;
                      transition: 0.3s;
                    }
                  `}
                />
              </div>
            </div>
            <div css={s_div_data}>
              <h5 css={s_h5_title}>{item.name}</h5>
              <div css={s_p_artist}>
                {item.artists.map((item, index) => (
                  <p key={index}>{item.name}</p>
                ))}
              </div>
            </div>
            <div
              css={css`
                z-index: 10;
                display: flex;
                justify-content: center;
                width: 10%;
                :hover {
                  background-color: #888;
                  border-radius: 100%;
                }
              `}
              onClick={(e) => e.stopPropagation()}
            >
              <DotDotDot
                data={[
                  {
                    iconImage: <FaRegHeart />,
                    text: '좋아요',
                    clickHandler: () => handleLike(item.id),
                    size: 20,
                  },
                  {
                    iconImage: <PiPlaylist />,
                    text: '플레이리스트 추가',
                    clickHandler: () => openModal(item.id),
                    size: 20,
                  },
                ]}
              />
            </div>
          </div>
        ))}
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal} musicId={musicId} />
    </>
  );
};

export default PopularList;
