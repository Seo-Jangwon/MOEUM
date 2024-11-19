import Lottie from 'lottie-react';
import { useEffect, useRef, useState } from 'react';
import { FaArrowLeft, FaArrowRight, FaPlay, FaRegHeart } from 'react-icons/fa';
import { FiClock } from 'react-icons/fi';
import playMusic from '../image/playMusic.json';

import apiClient from '@/api/apiClient';
import DotDotDot from '@/components/DotDotDot/DotDotDot';
import Modal from '@/pages/RecordPage/Modal/Modal';
import { PiPlaylist } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';
import {
  s_button,
  s_button_all,
  s_dropdownButton,
  s_div_button,
  s_div_h3,
  s_div_header,
  s_div_img,
  s_div_list,
  s_icon,
  s_img,
  s_lottie,
  s_p,
  s_play_button,
} from './style';

interface Music {
  id: number;
  name: string;
  image: string;
  artist: string[];
}

const NewList = () => {
  const listRef = useRef<HTMLDivElement>(null);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const navigate = useNavigate();
  const [latestData, setLatestData] = useState<Music[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [musicId, setMusicId] = useState<number>(0);

  const openModal = (id: number) => {
    setIsModalOpen(true);
    setMusicId(id);
  };

  // 모달 닫기 함수
  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    apiClient({
      method: 'GET',
      url: '/musics/latest',
    })
      .then((res) => {
        // console.log(res);
        if (res.data.code === 200) {
          setLatestData(res.data.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const updateItemsPerPage = () => {
    if (window.innerWidth <= 900) {
      setItemsPerPage(3);
    } else if (window.innerWidth <= 1200) {
      setItemsPerPage(4);
    } else {
      setItemsPerPage(5);
    }
  };

  useEffect(() => {
    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
    return () => {
      window.removeEventListener('resize', updateItemsPerPage);
    };
  }, []);

  const handlePrev = () => {
    if (listRef.current) {
      const item = listRef.current.querySelector('div');
      if (item) {
        const itemWidth = item.clientWidth;
        const gap = 20;
        const scrollAmount = (itemWidth + gap) * itemsPerPage;
        listRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      }
    }
  };

  const handleNext = () => {
    if (listRef.current) {
      const item = listRef.current.querySelector('div');
      if (item) {
        const itemWidth = item.clientWidth;
        const gap = 20;
        const scrollAmount = (itemWidth + gap) * itemsPerPage;
        listRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  const handlePlayClick = (index: number) => {
    setPlayingIndex((prevIndex) => (prevIndex === index ? null : index));
    navigate(`music?id=${index}`);
  };
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
          <FiClock />
          <h3>최신 발매곡</h3>
        </div>
        <div css={s_div_button}>
          <button css={s_button_all} onClick={() => navigate('list/newList')}>
            더 보기
          </button>

          <button css={s_button} onClick={handlePrev}>
            <FaArrowLeft />
          </button>
          <button css={s_button} onClick={handleNext}>
            <FaArrowRight />
          </button>
        </div>
      </div>
      <div css={s_div_list} ref={listRef}>
        {latestData.map((item, index) => (
          <div key={index} css={s_div_img}>
            <div css={s_dropdownButton}>
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
            <button css={s_play_button} onClick={() => handlePlayClick(item.id)}>
              <img src={item.image} alt="라라" css={s_img} />
              {playingIndex === index ? (
                <Lottie animationData={playMusic} loop={true} css={s_lottie} />
              ) : (
                <FaPlay css={s_icon} className="icon" size={20} />
              )}
            </button>
            <div>
              <p css={s_p}>{item.name}</p>
            </div>
          </div>
        ))}
        <Modal isOpen={isModalOpen} onClose={closeModal} musicId={musicId} />
      </div>
    </>
  );
};

export default NewList;
