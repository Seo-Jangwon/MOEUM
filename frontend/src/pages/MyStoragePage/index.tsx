import { css } from '@emotion/react';
import { useState } from 'react';
import LikeAlbum from './LikeAlbum/LikeAlbum';
import LikeArtist from './LikeArtist/LikeArtist';
import LikeMusic from './LikeMusic/LikeMusic';
import LikePlayList from './LikePlayList/LikePlayList';
import MyPlayList from './MyPlayList/MyPlayList';
import { activeButtonStyle, inactiveButtonStyle, s_container, s_div_toggle, s_h3 } from './style';

const MyStoragePage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('music');

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

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
        {selectedCategory === 'music' && <LikeMusic />}
        {/* 플레이리스트 */}
        {selectedCategory === 'playlist' && <LikePlayList />}
        {/* 아티스트 리스트 */}
        {selectedCategory === 'artist' && <LikeArtist />}
        {/* 앨범 리스트 */}
        {selectedCategory === 'album' && <LikeAlbum />}
        {/* 마이 플레이리스트 */}
        {selectedCategory === 'myPlayList' && <MyPlayList />}
      </div>
    </div>
  );
};

export default MyStoragePage;
