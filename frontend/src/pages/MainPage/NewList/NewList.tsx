import Lottie from 'lottie-react';
import { useEffect, useRef, useState } from 'react';
import { FaArrowLeft, FaArrowRight, FaPlay } from 'react-icons/fa';
import { FiClock } from 'react-icons/fi';
import lala from '@/assets/lalaticon/lala2.png';
import playMusic from '../image/playMusic.json';

import {
  s_button,
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
  title: string;
  img: string;
  artist: string;
}

const mokData: { music: Music[] } = {
  music: [
    { title: 'apt' },
    { title: 'abt' },
    { title: 'apt' },
    { title: 'apt' },
    { title: 'abt' },
    { title: 'apt' },
    { title: 'apt' },
    { title: 'abt' },
    { title: 'apt' },
    { title: 'apt' },
    { title: 'abt' },
    { title: 'apt' },
    { title: 'apt' },
    { title: 'abt' },
    { title: 'apt' },
    { title: 'apt' },
  ],
};

const NewList = () => {
  const listRef = useRef<HTMLDivElement>(null);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

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
        const gap = 40; // 아이템 간의 간격
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
        const gap = 40; // 아이템 간의 간격
        const scrollAmount = (itemWidth + gap) * itemsPerPage;
        listRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  const handlePlayClick = (index: number) => {
    setPlayingIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <>
      <div css={s_div_header}>
        <div css={s_div_h3}>
          <FiClock />
          <h3>최신 발매곡</h3>
        </div>
        <div>
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
            <button css={s_play_button} onClick={() => handlePlayClick(index)}>
              <img src={lala} alt="라라" css={s_img} />
              {playingIndex === index ? (
                <Lottie animationData={playMusic} loop={true} css={s_lottie} />
              ) : (
                <FaPlay css={s_icon} className="icon" />
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
