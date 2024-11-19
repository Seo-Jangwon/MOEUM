import apiClient from '@/api/apiClient';
import { s_div_item_box } from '@/pages/MainPage/GenreList/style';
import { useEffect, useState } from 'react';
import { s_img } from '../LikeMusic/style';
import { s_div_item_container, s_h5 } from './style';

interface Artist {
  id: number;
  name: string;
}

interface Album {
  id: number;
  name: string;
  image: string;
  artists: Artist[];
}

const LikeAlbum = () => {
  const [likeAlbum, setLikeAlbum] = useState<Album[]>([]);
  const [isExist, setIsExist] = useState<boolean>(false);

  useEffect(() => {
    apiClient({
      method: 'GET',
      url: '/musics/album/like',
    })
      .then((res) => {
        if (res.data.code === 200) {
          setLikeAlbum(res.data.data);
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
    <div css={s_div_item_container}>
      {!isExist ? (
        <div style={{ color: 'white' }}>좋아요한 앨범이 없습니다.</div>
      ) : (
        likeAlbum.map((item, index) => (
          <div key={index}>
            <button css={s_div_item_box}>
              <img src={item.image} alt="라라" css={s_img} />
            </button>
            <h5 css={s_h5}>{item.name}</h5>
          </div>
        ))
      )}
    </div>
  );
};

export default LikeAlbum;
