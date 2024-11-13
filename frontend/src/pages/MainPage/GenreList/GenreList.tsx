import apiClient from '@/api/apiClient';
import lala from '@/assets/lalaticon/lala7.png';
import DotDotDot from '@/components/DotDotDot/DotDotDot';
import { css } from '@emotion/react';
import { FaRegHeart } from 'react-icons/fa6';
import { FiThumbsUp } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { s_button_all, s_div_header } from '../NewList/style';
import { s_div_item_box, s_div_item_container, s_div_title, s_h5, s_img } from './style';

interface Music {
  id: number;
  title: string;
}

const mokData: { music: Music[] } = {
  music: [
    {
      id: 1,
      title: '봄',
    },
    {
      id: 1,
      title: '여름',
    },
    {
      id: 1,
      title: '가을',
    },
    {
      id: 1,
      title: '겨울',
    },
    {
      id: 1,
      title: 'Spring',
    },
    {
      id: 1,
      title: 'Summer',
    },
    {
      id: 1,
      title: 'Autumn',
    },
    {
      id: 1,
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
        <div css={s_div_title}>
          <FiThumbsUp />
          <h3>오늘의 장르</h3>
        </div>
        <button css={s_button_all} onClick={() => navigate('list/Genre')}>
          더 보기
        </button>
      </div>
      <div css={s_div_item_container}>
        {mokData.music.map((item, index) => (
          <div
            css={css`
              position: relative;
            `}
            key={index}
          >
            <button key={index} css={s_div_item_box} onClick={() => handleMusicPage('music/12')}>
              <img src={lala} alt="라라" css={s_img} />
              <h5 css={s_h5}>{item.title}</h5>
            </button>
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
          </div>
        ))}
      </div>
    </>
  );
};

export default GenreList;
