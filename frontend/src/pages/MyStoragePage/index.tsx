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

interface Music {
  title: string;
  artist: string;
}
interface PlayList {
  title: string;
}
interface Artist {
  title: string;
}

const musicList: { music: Music[] } = {
  music: [
    {
      title: 'we See the MUSIC',
      artist: 'ZOMBIE',
    },
    {
      title: 'we See the MUSIC',
      artist: 'ZOMBIE',
    },
    {
      title: 'we See the MUSIC',
      artist: 'ZOMBIE',
    },
    {
      title: 'we See the MUSIC',
      artist: 'ZOMBIE',
    },
    {
      title: 'we See the MUSIC',
      artist: 'ZOMBIE',
    },
    {
      title: 'we See the MUSIC',
      artist: 'ZOMBIE',
    },
    {
      title: 'we See the MUSIC',
      artist: 'ZOMBIE',
    },
    {
      title: 'we See the MUSIC',
      artist: 'ZOMBIE',
    },
    {
      title: 'we See the MUSIC',
      artist: 'ZOMBIE',
    },
  ],
};
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
const ArtistList: { artist: Artist[] } = {
  artist: [
    { title: '스트롱맨' },
    { title: '스트롱맨' },
    { title: '스트롱맨' },
    { title: '스트롱맨' },
    { title: '스트롱맨' },
    { title: '스트롱맨' },
  ],
};

const MyStoragePage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('music');

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  // 좋아요한 음악
  useEffect(() => {
    apiClient({
      method: 'GET',
      url: '/musics/playlist/like',
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // 좋아요한 플레이리스트
  useEffect(() => {
    apiClient({
      method: 'GET',
      url: '/musics/playlist/like',
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // 좋아요한 아티스트
  useEffect(() => {
    apiClient({
      method: 'GET',
      url: '/musics/artist/like',
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // 좋아요한 앨범
  useEffect(() => {
    apiClient({
      method: 'GET',
      url: '/musics/album/like',
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

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
          <div css={s_popular_container}>
            {musicList.music.map((item, index) => (
              <div key={index} css={s_popular_box}>
                <div>
                  <div
                    css={css`
                      border-radius: 100%;
                      overflow: hidden;
                      margin: 5%;
                      width: 50%;
                      :hover {
                        filter: brightness(0.5);
                      }
                    `}
                  >
                    <img
                      src={lala}
                      alt="라라"
                      css={css`
                        width: 100%;
                        object-fit: cover;
                      `}
                    />
                  </div>
                </div>
                <div css={s_div_data}>
                  <h5 css={s_h5_title}>{item.title}</h5>
                  <p css={s_p_artist}>{item.artist}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* 플레이리스트 */}
        {selectedCategory === 'playlist' && (
          <div
            css={css`
              display: flex;
              flex-wrap: wrap;
              gap: 20px;
            `}
          >
            {ArtistList.artist.map((item, index) => (
              <>
                <div
                  css={css`
                    position: relative;
                  `}
                >
                  <button
                    key={index}
                    css={css`
                      width: 36vw;
                      height: 10vw;
                      overflow: hidden;
                      border: none;
                      background: transparent;
                      border-radius: 20px;
                      :hover {
                        filter: brightness(50%);
                        transition: 0.3s;
                      }
                    `}
                  >
                    <img
                      src={lala}
                      alt="lala"
                      css={css`
                        width: 100%;
                      `}
                    />
                  </button>
                  <p css={s_playlist_p}>{item.title}</p>
                </div>
              </>
            ))}
          </div>
        )}
        {/* 아티스트 리스트 */}
        {selectedCategory === 'artist' && (
          <div css={s_div_item_container}>
            {ArtistList.artist.map((item, index) => (
              <>
                <div key={index}>
                  <button css={s_artist_button}>
                    <img src={lala} alt="라라" style={{ borderRadius: '100%' }} />
                  </button>
                  <p css={s_artist_p}>{item.title}</p>
                </div>
              </>
            ))}
          </div>
        )}
        {/* 앨범 리스트 */}
        {selectedCategory === 'album' && (
          <div css={s_div_item_container}>
            {playList.playList.map((item, index) => (
              <>
                <div>
                  <button key={index} css={s_div_item_box}>
                    <img src={lala} alt="라라" css={s_img} />
                  </button>
                  <h5 css={s_h5}>{item.title}</h5>
                </div>
              </>
            ))}
          </div>
        )}
        {/* 마이 플레이리스트 */}
        {selectedCategory === 'myPlayList' && (
          <div css={s_div_item_container}>
            {playList.playList.map((item, index) => (
              <>
                <div>
                  <button key={index} css={s_div_item_box}>
                    <img src={lala} alt="라라" css={s_img} />
                  </button>
                  <h5 css={s_h5}>{item.title}</h5>
                </div>
              </>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyStoragePage;
