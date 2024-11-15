import apiClient from '@/api/apiClient';
import DotDotDot from '@/components/DotDotDot/DotDotDot';
import {
  s_div_data,
  s_h5_title,
  s_p_artist,
  s_popular_box,
  s_popular_container,
} from '@/pages/MainPage/PopularList/style';
import Modal from '@/pages/RecordPage/Modal/Modal';
import { useEffect, useState } from 'react';
import { s_div_img, s_img } from './style';
import { FaRegHeart } from 'react-icons/fa6';
import { PiPlaylist } from 'react-icons/pi';

interface Artist {
  id: number;
  name: string;
}

interface Music {
  id: number;
  name: string;
  duration: string;
  albumTitle: string;
  albumImage: string;
  artists: Artist[];
}

const LikeMusic = () => {
  const [likeMusic, setLikeMusic] = useState<Music[]>([]);
  const [isExist, setIsExist] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    apiClient({
      method: 'GET',
      url: '/musics/music/like',
    })
      .then((res) => {
        console.log(res);
        if (res.data.code === 200) {
          setLikeMusic(res.data.data);
          if (res.data.data.length !== 0) {
            setIsExist(true);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleDisLike = (id: number) => {
    apiClient({
      method: 'DELETE',
      url: '/musics/music/like',
      data: { id },
    })
      .then((res) => {
        console.log(res);
        if (res.data.code === 200) {
          setLikeMusic((prevLikeMusic) => prevLikeMusic.filter((music) => music.id !== id))
          if (likeMusic.length === 1) {
            setIsExist(false)
          }
        }
        else {
          alert('좋아요 취소에 실패하였습니다.')
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div css={s_popular_container}>
      {!isExist ? (
        <div style={{ color: 'white' }}>좋아요한 음악이 없습니다.</div>
      ) : (
        likeMusic.map((item, index) => (
          <div key={index} css={s_popular_box}>
            <div>
              <div css={s_div_img}>
                <img src={item.albumImage} alt={item.name} css={s_img} />
              </div>
            </div>
            <div css={s_div_data}>
              <h5 css={s_h5_title}>{item.name}</h5>
              <p css={s_p_artist}>
                {item.artists.map((item, index) => (
                  <p key={index}>{item.name}</p>
                ))}
              </p>
            </div>
            <div>
              <DotDotDot
                data={[
                  {
                    iconImage: <FaRegHeart />,
                    text: '좋아요 취소',
                    clickHandler: () => handleDisLike(item.id),
                    size: 20,
                  },
                  {
                    iconImage: <PiPlaylist />,
                    text: '플레이리스트 추가',
                    clickHandler: () => openModal(),
                    size: 20,
                  },
                ]}
              />
            </div>
          </div>
        ))
      )}
      <Modal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default LikeMusic;
