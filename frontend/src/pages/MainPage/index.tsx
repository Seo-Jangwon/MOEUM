import { useState } from 'react';
import { s_h2, s_p, s_div_button, s_div_img, s_div_musicList } from './style';
import { css } from '@emotion/react';
import Button from '@/components/Button/Button';
import MusicCard from './MusicCard/MusicCard';
import newImage from './image/newyml.jpg';
import recommend from './image/recommend.jpg';
import famous from './image/famous.jpg';
import { HiOutlineArrowCircleRight } from 'react-icons/hi';
import { IoPlay } from 'react-icons/io5';

interface DiscographyItem {
  category: string;
  title: string;
  image: string;
}

interface MokData {
  musicList: DiscographyItem[];
}

const mokDataFamuous: MokData = {
  musicList: [
    {
      category: 'famous',
      title: 'APT.',
      image: famous,
    },
    {
      category: 'famous',
      title: 'APT.',
      image: famous,
    },
    {
      category: 'famous',
      title: 'APT.',
      image: famous,
    },
    {
      category: 'famous',
      title: 'APT.',
      image: famous,
    },
    {
      category: 'famous',
      title: 'APT.',
      image: famous,
    },
  ],
};

const mokDataNew: MokData = {
  musicList: [
    {
      category: 'new',
      title: 'dynamite.',
      image: newImage,
    },
    {
      category: 'new',
      title: 'dynamite.',
      image: newImage,
    },
    {
      category: 'new',
      title: 'dynamite.',
      image: newImage,
    },
    {
      category: 'new',
      title: 'dynamite.',
      image: newImage,
    },
    {
      category: 'new',
      title: 'dynamite.',
      image: newImage,
    },
  ],
};

const mokDataRecomment: MokData = {
  musicList: [
    {
      category: 'recommend',
      title: 'MSR.',
      image: recommend,
    },
    {
      category: 'recommend',
      title: 'MSR.',
      image: recommend,
    },
    {
      category: 'recommend',
      title: 'MSR.',
      image: recommend,
    },
    {
      category: 'recommend',
      title: 'MSR.',
      image: recommend,
    },
    {
      category: 'recommend',
      title: 'MSR.',
      image: recommend,
    },
  ],
};

const mokDataMap: { [key: string]: MokData } = {
  인기곡: mokDataFamuous,
  최신곡: mokDataNew,
  추천곡: mokDataRecomment,
};

const MainPage = () => {
  const genres = ['인기곡', '최신곡', '추천곡'];
  const [selectedGenreIndex, setSelectedGenreIndex] = useState<number>(1);

  const handleLeftClick = () => {
    setSelectedGenreIndex((prevIndex) => (prevIndex - 1 + genres.length) % genres.length);
  };

  const handleRightClick = () => {
    setSelectedGenreIndex((prevIndex) => (prevIndex + 1) % genres.length);
  };

  const selectedGenre = genres[selectedGenreIndex];
  const leftGenre = genres[(selectedGenreIndex - 1 + genres.length) % genres.length];
  const rightGenre = genres[(selectedGenreIndex + 1) % genres.length];

  const currentMokData = mokDataMap[selectedGenre];

  return (
    <div
      css={css`
        width: 60vw;
        @media (max-width: 767px) {
          width: 90vw;
        }
        margin: 0 auto;
      `}
    >
      {/* 상위 음악 종류 선택 영역 */}
      <div
        css={css`
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 20px;
        `}
      >
        <Button
          variant="grad"
          onClick={handleLeftClick}
          css={css`
            font-size: 1rem;
          `}
        >
          {leftGenre}
        </Button>
        <h2 css={s_h2}>
          <p css={s_p}>모음 님을 위한</p>
          {selectedGenre}
        </h2>
        <Button
          variant="grad"
          onClick={handleRightClick}
          css={css`
            font-size: 1rem;
          `}
        >
          {rightGenre}
        </Button>
      </div>
      {/* 해당하는 음악 보여주는 영역 */}
      <div css={s_div_musicList}>
        {currentMokData.musicList.map((data, index) => (
          <div css={s_div_img}>
            <MusicCard key={index} category={data.category} title={data.title} image={data.image} />
            <IoPlay
              className="play-icon"
              css={css`
                position: absolute;
                bottom: 20px;
                left: 20px;
                color: white;
                font-size: 24px;
                transform: scale(0);
                :hover {
                 
                }
              `}
            />
          </div>
        ))}
        <div css={s_div_button}>
          <HiOutlineArrowCircleRight />
        </div>
      </div>
    </div>
  );
};

export default MainPage;
