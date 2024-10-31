import { css } from '@emotion/react';
import GenreList from './GenreList/GenreLIst';
import NewList from './NewList/NewList';
import PopularList from './PopularList/PopularList';
import PopularPlayList from './PopularPlayList/PopularPlayList';

const MainPage = () => {
  return (
    // 전체 레이아웃
    <div
      css={css`
        display: flex;
        width: 75%;
        flex-direction: column;
        align-self: center;
      `}
    >
      {/* 신곡 리스트 */}
      <div>
        <NewList />
      </div>
      {/* 인기 리스트 */}
      <div>
        <PopularList />
      </div>
      {/* 플레이 리스트 */}
      <div>
        <PopularPlayList />
      </div>
      {/* 장르 리스트 */}
      <div>
        <GenreList />
      </div>
    </div>
  );
};

export default MainPage;