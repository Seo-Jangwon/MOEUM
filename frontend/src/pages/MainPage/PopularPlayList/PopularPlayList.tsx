import apiClient from '@/api/apiClient';
import lala from '@/assets/lalaticon/lala8.png';
import DotDotDot from '@/components/DotDotDot/DotDotDot';
import Modal from '@/pages/RecordPage/Modal/Modal';
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { FaRegHeart } from 'react-icons/fa6';
import { FiCrosshair } from 'react-icons/fi';
import { PiPlaylist } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';
import { s_button_all, s_div_header } from '../NewList/style';
import { s_div_button, s_div_h3, s_div_item_box, s_div_item_container, s_h5, s_icon_div } from './style';

interface PlayList {
  id: number;
  title: string;
}

const mokData: { data: PlayList[] } = {
  data: [
    {
      id: 1,
      title: '공부할 때 들으면 좋은 음악선',
    },
    {
      id: 2,
      title: '공부할 때 들으면 좋은 음악선',
    },
    {
      id: 3,
      title: '공부할 때 들으면 좋은 음악선',
    },
    {
      id: 4,
      title: '공부할 때 들으면 좋은 음악선',
    },
  ],
};

const handleLike = (id: number) => {
  apiClient({
    method: 'POST',
    url: '/musics/playlist/like',
    data: { id },
  })
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
};

interface Playlist {
  id: number;
  name: string;
  image: string;
}

const PopularPlayList = () => {
  const navigate = useNavigate();
  const [popularPlayList, setPopularPlayList] = useState<Playlist[]>([])
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);



  const handleMusicPage = (path: string) => {
    return navigate(path);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  // 모달 닫기 함수
  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    apiClient({
      method: 'GET',
      url: '/musics/popular/playlist',
    })
      .then((res) => {
        console.log(res);
        if (res.data.code === 200) {
          setPopularPlayList(res.data.data)
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <div css={s_div_header}>
        <div css={s_div_h3}>
          <FiCrosshair />
          <h3>인기 플레이리스트</h3>
        </div>
        <button css={s_button_all} onClick={() => navigate('list/playList')}>
          더 보기
        </button>
      </div>
      <div css={s_div_item_container}>
        {popularPlayList.map((item, index) => (
          <div css={s_div_item_box(lala)} key={index}>
            <div
              css={s_icon_div}
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
                    clickHandler: () => openModal(),
                    size: 20,
                  },
                ]}
              />
            </div>
            <button
              key={index}
              css={s_div_button}
              onClick={() => handleMusicPage(`playlist/${item.id}`)}
            >
              <h5 css={s_h5}>{item.name}</h5>
            </button>
          </div>
        ))}
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
};

export default PopularPlayList;
