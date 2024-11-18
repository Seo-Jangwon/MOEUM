import apiClient from '@/api/apiClient';
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
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
  const [genreData, setGenreData] = useState<Genre[]>([]);

  useEffect(() => {
    apiClient({
      method: 'GET',
      url: '/musics/todaygenre',
    })
      .then((res) => {
        // console.log(res);
        if (res.data.code === 200) {
          setGenreData(res.data.data.genres);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const hadnleNavigate = (id: number) => {
    apiClient({
      method: 'GET',
      url: `/musics/todaygenre/${id}`
    })
    .then((res) => {
      // console.log(res);
      if (res.data.code === 200) {
        const musicId = res.data.data.playlistId
        navigate(`/music?id=${id}&list=${musicId}`)
      }
    })
  }

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
        {genreData.slice(0, 5).map((item, index) => (
          <div
            css={css`
              position: relative;
            `}
            key={index}
          >
            <button key={index} css={s_div_item_box} onClick={() => hadnleNavigate(item.id)}>
              <img src={item.image} alt="라라" css={s_img} />
              <h5 css={s_h5}>{item.name}</h5>
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default GenreList;
