import apiClient from '@/api/apiClient';
import {
  s_div_data,
  s_h5_title,
  s_p_artist,
  s_popular_box,
  s_popular_container,
} from '@/pages/MainPage/PopularList/style';
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { s_div_img, s_img } from './style';

interface Artist {
  id: number;
  name: string;
}

interface Music {
  id: number;
  title: string;
  duration: string;
  albumTitle: string;
  albumImage: string;
  artists: Artist[];
}

const LikeMusic = () => {
  const [likeMusic, setLikeMusic] = useState<Music[]>([]);
  const [isExist, setIsExist] = useState<boolean>(false);

  useEffect(() => {
    apiClient({
      method: 'GET',
      url: '/musics/music/like',
    })
      .then((res) => {
        console.log(res);
        if (res.data.code === 200) {
          setIsExist(true);
          setLikeMusic(res.data.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div css={s_popular_container}>
      {!isExist ? (
        <div style={{color: 'white'}}>좋아요한 음악이 없습니다.</div>
      ) : (
        likeMusic.map((item, index) => (
          <div key={index} css={s_popular_box}>
            <div>
              <div
                css={s_div_img}
              >
                <img
                  src={item.albumImage}
                  alt={item.title}
                  css={s_img}
                />
              </div>
            </div>
            <div css={s_div_data}>
              <h5 css={s_h5_title}>{item.title}</h5>
              <p css={s_p_artist}>{item.artists[0]?.name || 'Unknown Artist'}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default LikeMusic;
