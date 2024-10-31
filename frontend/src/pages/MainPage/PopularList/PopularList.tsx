import { css } from '@emotion/react';
import { FiActivity } from 'react-icons/fi';
import lala from '../image/lala.jpg';
import { s_div_header } from '../NewList/style';
import { s_div_data, s_div_h3, s_h5_title, s_p_artist, s_popular_box, s_popular_container } from './style';

interface Music {
  title: string;
  artist: string;
}

const mokData: { music: Music[] } = {
  music: [
    {
      title: 'EscapeSSAFY',
      artist: 'MSR',
    },
    {
      title: 'EscapeSSAFY',
      artist: 'MSR',
    },
    {
      title: 'EscapeSSAFY',
      artist: 'MSR',
    },
    {
      title: 'EscapeSSAFY',
      artist: 'MSR',
    },
    {
      title: 'EscapeSSAFY',
      artist: 'MSR',
    },
    {
      title: 'EscapeSSAFY',
      artist: 'MSR',
    },
  ],
};

const PopularList = () => {
  return (
    <>
      <div css={s_div_header}>
        <div css={s_div_h3}>
          <FiActivity />
          <h3>지금 가장 HOT한 30</h3>
        </div>
        <button>모두보기</button>
      </div>
      <div
        css={s_popular_container}
      >
        {mokData.music.map((item, index) => (
          <div key={index} css={s_popular_box}>
            <div
              css={css`
                border-radius: 100%;
                overflow: hidden;
                margin: 2%;
                height: 73.5%;
              
              `}
            >
              <img
                src={lala}
                alt="라라"
                css={css`
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                `}
              />
            </div>
            <div css={s_div_data}>
              <h5 css={s_h5_title}>{item.title}</h5>
              <p css={s_p_artist}>{item.artist}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default PopularList;
