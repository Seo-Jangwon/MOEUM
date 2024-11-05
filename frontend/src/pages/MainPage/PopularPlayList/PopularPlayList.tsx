import lala from '@/assets/lalaticon/lala8.png';
import { FiCrosshair } from 'react-icons/fi';
import { s_div_header } from '../NewList/style';
import { s_div_h3, s_div_item_box, s_div_item_container, s_h5 } from './style';
import { useNavigate } from 'react-router-dom';

interface PlayList {
  title: string;
}

const mokData: { data: PlayList[] } = {
  data: [
    {
      title: '공부할 때 들으면 좋은 음악선',
    },
    {
      title: '공부할 때 들으면 좋은 음악선',
    },
    {
      title: '공부할 때 들으면 좋은 음악선',
    },
    {
      title: '공부할 때 들으면 좋은 음악선',
    },
  ],
};

const PopularPlayList = () => {
  const navigate = useNavigate();

  const handlePage = (path: string) => {
    return navigate(path)
  }
  const handleMusicPage = (path: string) => {
    return navigate(path)
  }

  return (
    <>
      <div css={s_div_header}>
        <div css={s_div_h3}>
          <FiCrosshair />
          <h3>인기 플레이리스트</h3>
        </div>
        <button onClick={() => handlePage('/list/playlist')}>모두보기</button>
      </div>
      <div css={s_div_item_container}>
        {mokData.data.map((item, index) => (
          <button key={index} css={s_div_item_box(lala)} onClick={() => handleMusicPage('music/1')}>
            <h5 css={s_h5}>{item.title}</h5>
          </button>
        ))}
      </div>
    </>
  );
};

export default PopularPlayList;
