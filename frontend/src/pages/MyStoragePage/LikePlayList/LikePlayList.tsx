import apiClient from '@/api/apiClient';
import DotDotDot from '@/components/DotDotDot/DotDotDot';
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { FaRegHeart } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const handleNavigate = (id: number) => {
    apiClient({
      method: 'GET',
      url: `musics/playlist/detail/${id}`,
    })
      .then((res) => {
        if (res.data.code === 200) {
          const musicId = res.data.data.musics.playlistMusics[0].id;
          navigate(`/music?id=${musicId}&list=${id}`);
        }
      })
      .catch((err) => {
        console.log(err);
        alert('플레이리스트에 음악이 존재하지 않습니다.');
      });
  };

  const handleDisLike = (id: number) => {
    apiClient({
      method: 'DELETE',
      url: '/musics/playlist/like',
      data: { id },
    }).then((res) => {
      if (res.data.code === 200) {
        setLikePlayList((prevLikeMusic) => prevLikeMusic.filter((music) => music.id != id));
      }
    });
  };

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
            onClick={(e) => {
              e.stopPropagation();
              handleNavigate(item.id);
            }}
          >
            <button key={index} css={s_div_button}>
              <img src={item.image} alt="lala" style={{ width: '100%' }} />
            </button>
            <p css={s_playlist_p}>{item.name}</p>
            <div
              css={css`
                position: absolute;
                bottom: 20px;
                right: 10px;
              `}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <DotDotDot
                data={[
                  {
                    iconImage: <FaRegHeart />,
                    text: '좋아요 취소',
                    clickHandler: () => handleDisLike(item.id),
                    size: 20,
                  },
                ]}
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default LikePlayList;
