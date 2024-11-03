import lala from '../../assets/lalaticon/lala.jpg';
import Heart from '../DetailPage/DetailCover/DetailCoverHeart';
import {
  s_container,
  s_div_container,
  s_div_img,
  s_div_item,
  s_div_titie_img,
  s_div_title,
  s_h4,
  s_img,
  s_p,
} from './style';

interface Record {
  title: string;
  image: string;
  artist: string;
  time: string;
  heart: boolean;
}

const mokData: { music: Record[] } = {
  music: [
    {
      title: 'fkfㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ',
      image: 'lala.jpg',
      artist: 'LALA',
      time: '4:10',
      heart: true,
    },
    {
      title: '라라',
      image: 'lala.jpg',
      artist: 'LALA',
      time: '4:10',
      heart: false,
    },
    {
      title: '라라',
      image: 'lala.jpg',
      artist: 'LALA',
      time: '4:10',
      heart: true,
    },
  ],
};

const RecordPage = () => {
  return (
    // 전체 레이아웃
    <div css={s_container}>
      {/* 최근 감상 기록 텍스트 */}
      <div css={s_div_title}>
        <h3>최근 감상 기록</h3>
      </div>
      {/* 최근 음악 데이터 */}
      <div css={s_div_container}>
        {mokData.music.map((item, index) => (
          <div key={index} css={s_div_item}>
            {/* 이미지와 제목 */}
            <div css={s_div_titie_img}>
              <div css={s_div_img}>
                <img src={lala} alt="라라" css={s_img} />
              </div>
              <h4 css={s_h4}>{item.title}</h4>
            </div>
            {/* 아티스트 */}
            <p css={s_p}>{item.artist}</p>
            {/* 하트 아이콘 */}
            <Heart isLike={item.heart} />
            {/* 시간 */}
            <p css={s_p}>{item.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecordPage;
