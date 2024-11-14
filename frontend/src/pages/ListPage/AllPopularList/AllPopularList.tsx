import apiClient from '@/api/apiClient';
import { s_div_header } from '@/pages/MainPage/NewList/style';
import {
  s_div_data,
  s_div_h3,
  s_h5_title,
  s_popular_box,
  s_popular_container,
} from '@/pages/MainPage/PopularList/style';
import { s_container } from '@/pages/MainPage/style';
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ListPageProps {
  title: string;
}

interface Artist {
  id: number;
  name: string;
}

interface Music {
  id: number;
  name: string;
  image: string;
  artists: Artist[];
}
const AllPopularList = ({ title }: ListPageProps) => {
  const navigate = useNavigate();
  const [popularList, setPopularList] = useState<Music[]>([]);

  useEffect(() => {
    apiClient({
      method: 'GET',
      url: '/musics/popular',
    })
      .then((res) => {
        console.log(res);
        if (res.data.code === 200) {
          setPopularList(res.data.data);
        }
      })
      .catch((err) => {
        alert('서비스 점검 중입니다.');
        console.log(err);
      });
  });

  return (
    <div css={s_container}>
      <div
        css={css`
          display: flex;
          flex-direction: column;
          gap: 20px;
        `}
      >
        <div css={s_div_header}>
          <div css={s_div_h3}>
            <h3>{title} 전체보기</h3>
          </div>
        </div>
        <div css={s_popular_container}>
          {popularList.map((item, index) => (
            <div key={index} css={s_popular_box} onClick={() => navigate('/music/1')}>
              <div
                css={css`
                  border-radius: 100%;
                  overflow: hidden;
                  margin: 2%;
                  height: 73.5%;
                  aspect-ratio: 1 / 1;
                `}
              >
                <img
                  src={item.image}
                  alt="라라"
                  css={css`
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                  `}
                />
              </div>
              <div css={s_div_data}>
                <h5 css={s_h5_title}>{item.name} </h5>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllPopularList;
