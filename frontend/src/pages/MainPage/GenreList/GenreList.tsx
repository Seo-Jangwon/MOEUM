import lala from '@/assets/lalaticon/lala7.png';
import { FiThumbsUp } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { s_div_header } from '../NewList/style';
import { s_div_item_box, s_div_item_container, s_div_title, s_h5, s_img } from './style';

interface Music {
  title: string;
}

const mokData: { music: Music[] } = {
  music: [
    {
      title: '봄',
    },
    {
      title: '여름',
    },
    {
      title: '가을',
    },
    {
      title: '겨울',
    },
    {
      title: 'Spring',
    },
    {
      title: 'Summer',
    },
    {
      title: 'Autumn',
    },
    {
      title: 'Winter',
    },
  ],
};

const GenreList = () => {
  const navigate = useNavigate();
  const handlePage = (path: string) => {
    navigate(path);
  };
  const handleMusicPage = (path: string) => {
    navigate(path);
  };
  return (
    <>
      <div css={s_div_header}>
        <div css={s_div_title}>
          <FiThumbsUp />
          <h3>오늘의 장르</h3>
        </div>
        <button onClick={() => handlePage('/list/genre')}>모두보기</button>
      </div>
      <div css={s_div_item_container}>
        {mokData.music.map((item, index) => (
          <button key={index} css={s_div_item_box} onClick={() => handleMusicPage('music/12')}>
            <img src={lala} alt="라라" css={s_img} />
            <h5 css={s_h5}>{item.title}</h5>
          </button>
        ))}
      </div>
    </>
  );
};

export default GenreList;
