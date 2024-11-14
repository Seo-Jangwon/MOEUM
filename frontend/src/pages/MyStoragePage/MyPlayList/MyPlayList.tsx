import apiClient from '@/api/apiClient';
import { s_div_item_box, s_h5 } from '@/pages/MainPage/GenreList/style';
import { s_div_item_container } from '@/pages/MainPage/PopularPlayList/style';
import { useEffect, useState } from 'react';
import { s_img } from '../LikeMusic/style';

interface Playlist {
  id: number;
  title: string;
  image: string;
  totalDuration: string;
  totalMusicCount: number;
}

const MyPlayList = () => {
  const [myPlayList, setMyPlayList] = useState<Playlist[]>([]);
  const [isExist, setIsExist] = useState<boolean>(false);

  useEffect(() => {
    apiClient({
      method: 'GET',
      url: '/musics/playlist',
    })
      .then((res) => {
        console.log(res);
        if (res.data.code === 200) {
          setIsExist(true);
          setMyPlayList(res.data.data.musics);
          console.log(res.data.data);
          
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },[]);

  return (
    <div css={s_div_item_container}>
      {!isExist ? (
        <div style={{color: 'white'}}>아직 만든 플레이리스트가 존재하지 않습니다.</div>
      ) : (
        myPlayList.map((item, index) => (
          <>
            <div>
              <button key={index} css={s_div_item_box}>
                <img src={item.image} alt="라라" css={s_img} />
              </button>
              <h5 css={s_h5}>{item.title}</h5>
            </div>
          </>
        ))
      )}
    </div>
  );
};

export default MyPlayList;
