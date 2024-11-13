import apiClient from '@/api/apiClient';
import lala from '@/assets/lalaticon/lala2.png';
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { s_div_item_box, s_div_item_container, s_h5, s_img } from '../MainPage/GenreList/style';
import {
  s_div_data,
  s_h5_title,
  s_p_artist,
  s_popular_box,
  s_popular_container,
} from '../MainPage/PopularList/style';
import {
  activeButtonStyle,
  inactiveButtonStyle,
  s_artist_button,
  s_artist_p,
  s_container,
  s_div_toggle,
  s_h3,
  s_playlist_p,
} from './style';
import LikeMusic from './LikeMusic/LikeMusic';
import LikePlayList from './LikePlayList/LikePlayList';
import LikeArtist from './LikeArtist/LikeArtist';
import LikeAlbum from './LikeAlbum/LikeAlbum';
import MyPlayList from './MyPlayList/MyPlayList';



const playList: { playList: PlayList[] } = {
  playList: [
    { title: '안녕하세용' },
    { title: '안녕하세용' },
    { title: '안녕하세용' },
    { title: '안녕하세용' },
    { title: '안녕하세용' },
    { title: '안녕하세용' },
    { title: '안녕하세용' },
  ],
};


const MyStoragePage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('music');

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

 

  // 내 플레이리스트
  useEffect(() => {
    apiClient({
      method: 'GET',
      url: '/musics/playlist',
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div css={s_container}>
      {/* 타이틀 */}
      <h3 css={s_h3}>내 보관함</h3>
      {/* 버튼 토글 위치 */}
      <div css={s_div_toggle}>
        <div
          css={css`
            display: flex;
            gap: 5px;
          `}
        >
          <button
            onClick={() => handleCategoryChange('music')}
            css={selectedCategory === 'music' ? activeButtonStyle : inactiveButtonStyle}
          >
            음악
          </button>
          <button
            onClick={() => handleCategoryChange('playlist')}
            css={selectedCategory === 'playlist' ? activeButtonStyle : inactiveButtonStyle}
          >
            플레이리스트
          </button>
          <button
            onClick={() => handleCategoryChange('artist')}
            css={selectedCategory === 'artist' ? activeButtonStyle : inactiveButtonStyle}
          >
            아티스트
          </button>
          <button
            onClick={() => handleCategoryChange('album')}
            css={selectedCategory === 'album' ? activeButtonStyle : inactiveButtonStyle}
          >
            앨범
          </button>
        </div>
        <div>
          <button
            onClick={() => handleCategoryChange('myPlayList')}
            css={selectedCategory === 'myPlayList' ? activeButtonStyle : inactiveButtonStyle}
          >
            내 플레이리스트
          </button>
        </div>
      </div>
      {/* 리스트들 나오는 곳 */}
      <div>
        {/* 음악 리스트 */}
        {selectedCategory === 'music' && (
         <LikeMusic />
        )}
        {/* 플레이리스트 */}
        {selectedCategory === 'playlist' && (
         <LikePlayList />
        )}
        {/* 아티스트 리스트 */}
        {selectedCategory === 'artist' && (
          <LikeArtist />
        )}
        {/* 앨범 리스트 */}
        {selectedCategory === 'album' && (
         <LikeAlbum />
        )}
        {/* 마이 플레이리스트 */}
        {selectedCategory === 'myPlayList' && (
          <MyPlayList />
        )}
      </div>
    </div>
  );
};

export default MyStoragePage;
