import MusicCard from '@/components/Card/MusicCard/MusicCard';
import { HiOutlineArrowCircleRight } from 'react-icons/hi';
import { s_div_button, s_div_musicList } from '../FirstMainPage/style';
import { css } from '@emotion/react';
import Musk from './image/musk.jpg';
import { s_h1 } from './style';
import { Link } from 'react-router-dom';

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
      image: 'famous',
    },
    {
      category: 'famous',
      title: 'APT.',
      image: 'famous',
    },
    {
      category: 'famous',
      title: 'APT.',
      image: 'famous',
    },
    {
      category: 'famous',
      title: 'APT.',
      image: 'famous',
    },
    {
      category: 'famous',
      title: 'APT.',
      image: 'famous',
    },
    {
      category: 'famous',
      title: 'APT.',
      image: 'famous',
    },
    {
      category: 'famous',
      title: 'APT.',
      image: 'famous',
    },
    {
      category: 'famous',
      title: 'APT.',
      image: 'famous',
    },
    {
      category: 'famous',
      title: 'APT.',
      image: 'famous',
    },
  ],
};
const SecondMainPage = () => {
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
      {/* 상단 제목   */}
      <div>
        <h1 css={s_h1}>아티스트별 곡</h1>
      </div>
      {/* 아티스트 리스트 */}
      <div css={s_div_musicList}>
        {mokDataFamuous.musicList.map((data, index) => (
          <Link to={data.title}>
            <MusicCard key={index} category={data.category} title={data.title} image={Musk} />
          </Link>
        ))}
        <button css={s_div_button}>
          <HiOutlineArrowCircleRight />
        </button>
      </div>
    </div>
  );
};

export default SecondMainPage;
