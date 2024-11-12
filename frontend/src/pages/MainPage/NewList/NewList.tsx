import lala from '@/assets/lalaticon/lala2.png';
import Lottie from 'lottie-react';
import { useEffect, useRef, useState } from 'react';
import { FaArrowLeft, FaArrowRight, FaPlay, FaRegHeart } from 'react-icons/fa';
import { FiClock } from 'react-icons/fi';
import playMusic from '../image/playMusic.json';

import apiClient from '@/api/apiClient';
import Button from '@/components/Button/Button';
import DotDotDot from '@/components/DotDotDot/DotDotDot';
import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import {
  s_button,
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
  title: string;
  img: string;
  artist: string;
}

const mokData: { music: Music[] } = {
  music: [
    { id: 1, title: 'apt' },
    { id: 1, title: 'apt' },
    { id: 1, title: 'apt' },
    { id: 1, title: 'apt' },
    { id: 1, title: 'apt' },
    { id: 1, title: 'apt' },
    { id: 1, title: 'apt' },
    { id: 1, title: 'apt' },
    { id: 1, title: 'apt' },
  ],
};

const NewList = () => {
  const listRef = useRef<HTMLDivElement>(null);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    apiClient({
      method: 'GET',
      url: '/musics/popular',
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  });

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
        const gap = 20; // 아이템 간의 간격
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
        const gap = 20; // 아이템 간의 간격
        const scrollAmount = (itemWidth + gap) * itemsPerPage;
        listRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  const handlePlayClick = (index: number) => {
    setPlayingIndex((prevIndex) => (prevIndex === index ? null : index));
    navigate(`music/${index}`);
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

  return (
    <>
      <div css={s_div_header}>
        <div css={s_div_h3}>
          <FiClock />
          <h3>최신 발매곡</h3>
        </div>
        <div css={s_div_button}>
          <Button
            variant="outline"
            children="더 보기"
            onClick={() => navigate('list/newList')}
          ></Button>
          <button css={s_button} onClick={handlePrev}>
            <FaArrowLeft />
          </button>
          <button css={s_button} onClick={handleNext}>
            <FaArrowRight />
          </button>
        </div>
      </div>
      <div css={s_div_list} ref={listRef}>
        {mokData.music.map((item, index) => (
          <div key={index} css={s_div_img}>
            <div
              css={css`
                position: absolute;
                z-index: 1;
                right: 10px;
                bottom: 40px;
                :hover {
                  background-color: #888;
                  border-radius: 100%;
                }
                @media (max-width: 768px) {
                  right: 5px;
                  bottom: 20px;
                }
              `}
            >
              <DotDotDot
                data={[
                  {
                    iconImage: <FaRegHeart />,
                    text: '좋아요',
                    clickHandler: () => handleLike(item.id),
                    size: 20,
                  },
                ]}
              />
            </div>
            <button css={s_play_button} onClick={() => handlePlayClick(index)}>
              <img src={lala} alt="라라" css={s_img} />
              {playingIndex === index ? (
                <Lottie animationData={playMusic} loop={true} css={s_lottie} />
              ) : (
                <FaPlay css={s_icon} className="icon" size={20} />
              )}
            </button>
            <div>
              <p css={s_p}>{item.title}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default NewList;
