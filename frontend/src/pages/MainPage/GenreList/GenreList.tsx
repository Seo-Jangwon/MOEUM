import apiClient from '@/api/apiClient';
import DotDotDot from '@/components/DotDotDot/DotDotDot';
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { FaRegHeart } from 'react-icons/fa6';
import { FiThumbsUp } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { s_button_all, s_div_header } from '../NewList/style';
import { s_div_item_box, s_div_item_container, s_div_title, s_h5, s_img } from './style';




interface Genre {
  id: number;
  name: string;
  image: string;
}

const GenreList = () => {
  const navigate = useNavigate();
  const [genreData, setGenreData] = useState<Genre[]>([])
  
  useEffect(() => {
    apiClient({
      method: 'GET',
      url: '/musics/todaygenre',
    })
      .then((res) => {
        console.log(res);
        if (res.data.code === 200) {
          setGenreData(res.data.data.genres)
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },[]);

  const handleMusicPage = (path: string) => {
    console.log(path  + " hey");
    
    navigate(`/playlist/${path}`);
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
        {genreData.map((item, index) => (
          <div
            css={css`
              position: relative;
            `}
            key={index}
          >
            <button key={index} css={s_div_item_box} onClick={() => handleMusicPage(`${item.id}`)}>
              <img src={item.image} alt="라라" css={s_img} />
              <h5 css={s_h5}>{item.name}</h5>
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
