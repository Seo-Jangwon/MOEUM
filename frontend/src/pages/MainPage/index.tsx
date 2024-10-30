import FirstMainPage from './FirstMainPage/FirstMainPage';
import SecondMainPage from './SecondMainPage/SecondMainPage';
import ThirdMainPage from './ThirdMainPage/ThirdMainPage';
import { s_scroll, s_scroll_container } from './style';

const MainPage = () => {
  return (
    <div css={s_scroll_container}>
      <div css={s_scroll}>
        <FirstMainPage />
      </div>
      <div css={s_scroll}>
        <SecondMainPage />
      </div>
      <div css={s_scroll}>
        <ThirdMainPage />
      </div>
    </div>
  );
};

export default MainPage;