import apiClient from '@/api/apiClient';
import DotDotDot from '@/components/DotDotDot/DotDotDot';
import { useEffect, useState } from 'react';
import { FaRegHeart } from 'react-icons/fa6';
import { FiCrosshair } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { s_button_all, s_div_header } from '../NewList/style';
import { s_coverImage, s_div_button, s_div_h3, s_div_item_box, s_div_item_container, s_h5, s_icon_div } from './style';

const handleLike = (id: number) => {
  apiClient({
    method: 'POST',
    url: '/musics/playlist/like',
    data: { id },
  })
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
};

interface Playlist {
  id: number;
  name: string;
  image: string;
}

const PopularPlayList = () => {
  const navigate = useNavigate();
  const [popularPlayList, setPopularPlayList] = useState<Playlist[]>([]);

  const handleMusicPage = (path: string) => {
    return navigate(path);
  };

  useEffect(() => {
    apiClient({
      method: 'GET',
      url: '/musics/popular/playlist',
    })
      .then((res) => {
        console.log(res);
        if (res.data.code === 200) {
          setPopularPlayList(res.data.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <div css={s_div_header}>
        <div css={s_div_h3}>
          <FiCrosshair />
          <h3>인기 플레이리스트</h3>
        </div>
        <button css={s_button_all} onClick={() => navigate('list/playList')}>
          더 보기
        </button>
      </div>
      <div css={s_div_item_container}>
        {popularPlayList.map((item, index) => (
          <div css={s_div_item_box} key={index}>
            <div css={s_icon_div}>
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
            <button key={index} css={s_div_button} onClick={() => handleMusicPage(`playlist/${item.id}`)}>
              <img src={item.image} alt="PlayListImage" css={s_coverImage} />
              <h5 css={s_h5}>{item.name}</h5>
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default PopularPlayList;
