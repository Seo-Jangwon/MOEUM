import { css } from "@emotion/react";
import { s_h1 } from "../SecondMainPage/style";
import { s_div_button, s_div_musicList } from "../FirstMainPage/style";
import MusicCard from "@/components/Card/MusicCard/MusicCard";
import { HiOutlineArrowCircleRight } from "react-icons/hi";
import Picture from './image/album.jpg'
import { Link } from "react-router-dom";




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
const ThirdMainPage = () => {
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
        <h1 css={s_h1}>앨범 </h1>
      </div>
      {/* Album 리스트 */}
      <div css={s_div_musicList}>
        {mokDataFamuous.musicList.map((data, index) => (
          <Link to={data.title}>
          <MusicCard key={index} category={data.category} title={data.title} image={Picture} />
          </Link>
        ))}
        <button css={s_div_button}>
          <HiOutlineArrowCircleRight />
        </button>
      </div>
    </div>
  );
};

export default ThirdMainPage;
