import GenreList from './GenreList/GenreList';
import NewList from './NewList/NewList';
import PopularList from './PopularList/PopularList';
import PopularPlayList from './PopularPlayList/PopularPlayList';
import { s_box, s_container } from './style';

const MainPage = () => {
  return (
    // 전체 레이아웃
    <div css={s_container}>
      {/* 신곡 리스트 */}
      <div css={s_box}>
        <NewList />
      </div>
      {/* 인기 리스트 */}
      <div css={s_box}>
        <PopularList />
      </div>
      {/* 플레이 리스트 */}
      <div css={s_box}>
        <PopularPlayList />
      </div>
      {/* 장르 리스트 */}
      <div css={s_box}>
        <GenreList />
      </div>
    </div>
  );
};

export default MainPage;
