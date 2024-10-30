import { useState } from 'react';
import { s_h2, s_p, s_div_button, s_div_musicList, s_div_selector } from './style';
import { css } from '@emotion/react';
import Button from '@/components/Button/Button';
import newImage from './image/newyml.jpg';
import recommend from './image/recommend.jpg';
import famous from './image/famous.jpg';
import { HiOutlineArrowCircleRight } from 'react-icons/hi';
import MusicCard from '@/components/Card/MusicCard/MusicCard';
import { Link } from 'react-router-dom';
import { to } from './../../../../node_modules/rollup/dist/es/shared/node-entry';

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

  const handleLink = () => {
    console.log('MSR');
  };

  return (
    <div
      css={css`
        width: 80vw;
        display: flex;
        flex-direction: column;
        gap: 50px;

        @media (max-width: 767px) {
          width: 90vw;
        }
      `}
    >
      {/* 상위 음악 종류 선택 영역 */}
      <div css={s_div_selector}>
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
          <Link to={data.title}>
            <MusicCard
              key={index}
              category={data.category}
              title={data.title}
              image={data.image}
              onClick={handleLink}
            />
          </Link>
        ))}
        <button css={s_div_button}>
          <HiOutlineArrowCircleRight />
        </button>
      </div>
    </div>
  );
};

export default MainPage;
