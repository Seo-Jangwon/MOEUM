import apiClient from '@/api/apiClient';
import { s_div_item_container } from '@/pages/MainPage/PopularPlayList/style';
import { useEffect, useState } from 'react';
import { s_artist_button, s_artist_p } from '../style';

interface Artist {
  id: number;
  name: string;
  image: string;
}
const LikeArtist = () => {
  const [likeArtist, setLikeArtist] = useState<Artist[]>([]);
  const [isExist, setIsExist] = useState<boolean>(false);

  useEffect(() => {
    apiClient({
      method: 'GET',
      url: '/musics/artist/like',
    })
      .then((res) => {
        console.log(res);
        if (res.data.code === 200) {
          setLikeArtist(res.data.data);
          if (res.data.data.length !== 0) {
            setIsExist(true)
          }
          
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },[]);

  return (
    <div css={s_div_item_container}>
      {!isExist ? (
        <div style={{color: 'white'}}>좋아요한 아티스트가 없습니다.</div>
      ) : (
        likeArtist.map((item, index) => (
          <>
            <div key={index}>
              <button css={s_artist_button}>
                <img src={item.image} alt="라라" style={{ borderRadius: '100%' }} />
              </button>
              <p css={s_artist_p}>{item.name}</p>
            </div>
          </>
        ))
      )}
    </div>
  );
};

export default LikeArtist;
