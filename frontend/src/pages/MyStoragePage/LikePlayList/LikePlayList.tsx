import apiClient from '@/api/apiClient';
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { s_playlist_p } from '../style';
import { s_div_button } from './style';

interface Playlist {
  id: number;
  name: string;
  image: string;
  totalDuration: string;
  totalMusicCount: number;
}

const LikePlayList = () => {
  const [likePlayList, setLikePlayList] = useState<Playlist[]>([]);
  const [isExist, setIsExist] = useState<boolean>(false);

  useEffect(() => {
    apiClient({
      method: 'GET',
      url: '/musics/playlist/like',
    })
      .then((res) => {
        console.log(res);
        if (res.data.code === 200) {
          setLikePlayList(res.data.data);
          if (res.data.data.length !== 0) {
            setIsExist(true);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div
      css={css`
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
      `}
    >
      {!isExist ? (
        <div style={{ color: 'white' }}>좋아요한 플레이리스트가 없습니다.</div>
      ) : (
        likePlayList.map((item, index) => (
          <div
            key={index}
            css={css`
              position: relative;
            `}
          >
            <button key={index} css={s_div_button}>
              <img src={item.image} alt="lala" style={{ width: '100%', height: '100%' }} />
            </button>
            <p css={s_playlist_p}>{item.name}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default LikePlayList;
