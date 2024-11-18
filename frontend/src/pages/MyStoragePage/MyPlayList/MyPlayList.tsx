import apiClient from '@/api/apiClient';
import { s_h5 } from '@/pages/MainPage/GenreList/style';
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { s_div_item_box, s_div_item_container } from './style';
import { useNavigate } from 'react-router-dom';

interface Playlist {
  id: number;
  name: string;
  image: string;
  totalDuration: string;
  totalMusicCount: number;
}

const MyPlayList = () => {
  const [myPlayList, setMyPlayList] = useState<Playlist[]>([]);
  const [isExist, setIsExist] = useState<boolean>(false);
  const navigate = useNavigate()

  const handleNavigate = (id: number) => {
    apiClient({
      method: 'GET',
      url: `/musics/playlist/detail/${id}`
    })
    .then((res) => {
      if (res.data.code === 200) {
        const musicId = res.data.data.musics.playlistMusics[0].id;
        navigate(`/music?id=${musicId}&list=${id}`);
      }
    })
    .catch((err) => {
      console.log(err);
      alert('플레이리스트에 음악이 존재하지 않습니다.')
      
    })
  }

  useEffect(() => {
    apiClient({
      method: 'GET',
      url: '/musics/playlist/create',
    })
      .then((res) => {
        // console.log(res);
        if (res.data.code === 200) {
          setMyPlayList(res.data.data.musics);
          if (res.data.data.musics.length !== 0) {
            setIsExist(true);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div css={s_div_item_container}>
      {!isExist ? (
        <div style={{ color: 'white' }}>아직 만든 플레이리스트가 존재하지 않습니다.</div>
      ) : (
        myPlayList.map((item, index) => (
          <>
            <div>
              <button key={index} css={s_div_item_box} onClick={() => handleNavigate(item.id)}>
                <img
                  src={item.image}
                  alt="라라"
                  css={css`
                    object-fit: cover;
                    width: 100%;
                    border-radius: 10px;
                  `}
                />
              </button>
              <h5 css={s_h5}>{item.name}</h5>
            </div>
          </>
        ))
      )}
    </div>
  );
};

export default MyPlayList;
