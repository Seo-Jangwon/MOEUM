import lala from '@/assets/lalaticon/lala4.png';
import { css } from '@emotion/react';
import { useParams } from 'react-router-dom';
import { s_div_header } from '../MainPage/NewList/style';
import {
  s_div_data,
  s_div_h3,
  s_h5_title,
  s_popular_box,
  s_popular_container,
} from '../MainPage/PopularList/style';
import { s_div_item_box, s_div_item_container, s_h5 } from '../MainPage/PopularPlayList/style';
import { s_container } from '../MainPage/style';

interface Music {
  title: string;
  image: string;
}

const mokData: { music: Music[] } = {
  music: [
    { title: '라라랜드', image: 'dfd.jpg' },
    { title: '라라랜드', image: 'dfd.jpg' },
    { title: '라라랜드', image: 'dfd.jpg' },
    { title: '라라랜드', image: 'dfd.jpg' },
    { title: '라라랜드', image: 'dfd.jpg' },
    { title: '라라랜드', image: 'dfd.jpg' },
    { title: '라라랜드', image: 'dfd.jpg' },
    { title: '라라랜드', image: 'dfd.jpg' },
    { title: '라라랜드', image: 'dfd.jpg' },
    { title: '라라랜드', image: 'dfd.jpg' },
    { title: '라라랜드', image: 'dfd.jpg' },
    { title: '라라랜드', image: 'dfd.jpg' },
    { title: '라라랜드', image: 'dfd.jpg' },
    { title: '라라랜드', image: 'dfd.jpg' },
  ],
};

const ListPage = () => {
  const { id } = useParams();

  if (id === 'genre' || id == 'newList') {
    // 장르, 새로운 곡 리스트 페이지 /////////////////////////////////////////
    return (
      <div css={s_container}>
        {/* 전체 박스 */}
        <div>
          {/* {이름} 모두보기 div */}
          <div
            css={css`
              font-size: 36px;
              font-weight: 700;
              color: white;
              padding: 16px;
            `}
          >
            <h3>{id} 전체 보기</h3>
          </div>
          {/* 음악 데이터 박스*/}
          <div
            css={css`
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
              gap: 10px;
            `}
          >
            {mokData.music.map((item, index) => (
              <button
                key={index}
                css={css`
                  background: transparent;
                  border: 0;
                  position: relative;
                  overflow: hidden;
                  :hover::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.5);
                    border-radius: 20px;
                  }

                  :hover > p {
                    opacity: 1;
                    transition: opacity 0.3s;
                  }
                `}
              >
                <img
                  src={lala}
                  alt="라라"
                  css={css`
                    width: 100%;
                    border-radius: 20px;
                    display: block;
                  `}
                />
                <p
                  css={css`
                    font-size: 24px;
                    font-weight: 700;
                    color: white;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    opacity: 0;
                    z-index: 1;
                    transition: opacity 0.3s;
                  `}
                >
                  {item.title}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  } else if (id === 'popular') {
    // 인기차트 리스트 페이지 //////////////////////////////////////////////
    return (
      <div css={s_container}>
        <div>
          <div css={s_div_header}>
            <div css={s_div_h3}>
              <h3>인기차트</h3>
            </div>
          </div>
          <div css={s_popular_container}>
            {mokData.music.map((item, index) => (
              <div key={index} css={s_popular_box}>
                <div
                  css={css`
                    border-radius: 100%;
                    overflow: hidden;
                    margin: 2%;
                    height: 73.5%;
                    aspect-ratio: 1 / 1;
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
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  } else {
    // 플레이 리스트 페이지 ////////////////////////////////////////////////////
    return (
      <div css={s_container}>
        <div>
          <div
            css={css`
              font-size: 36px;
              font-weight: 700;
              color: white;
              padding: 16px;
            `}
          >
            <h3>{id} 전체 보기</h3>
          </div>
          <div css={s_div_item_container}>
            {mokData.music.map((item, index) => (
              <button key={index} css={s_div_item_box(lala)}>
                <h5 css={s_h5}>{item.title}</h5>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }
};

export default ListPage;
