import apiClient from '@/api/apiClient';
import lala from '@/assets/lalaticon/lala4.png';
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  id: number;
  name: string;
  image: string;
  artist: string[];
}

const ListPage = () => {
  const { id } = useParams();
  const [title, setTitle] = useState<string>('');
  const [latestData, setLatestData] = useState<Music[]>([]);
  const [popularList, setPopularList] = useState<Music[]>([])


  const navigate = useNavigate();
  useEffect(() => {
    if (id === 'Genre') {
      setTitle('장르');
    } else if (id === 'newList') {
      setTitle('최신곡');
      apiClient({
        method: 'GET',
        url: '/musics/latest',
      })
        .then((res) => {
          console.log(res);
          if (res.data.code === 200) {
            console.log(res.data.data);
            setLatestData(res.data.data);
            console.log(latestData);
          }
        })
        .catch((err) => {
          console.log(err);
        });
      console.log(latestData);
    } else if (id === 'Popular') {
      setTitle('인기곡');
      apiClient({
        method: 'GET',
        url: '/musics/popular',
      })
        .then((res) => {
          const jsonString = JSON.stringify(res.data.data);
          console.log(jsonString);
          console.log(res.data.data);
          if (res.data.code === 200) {
            setPopularList(res.data.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (id === 'playList') {
      setTitle('플레이리스트');
    } else {
      setTitle('');
    }
  }, [id]);

  if (id === 'Genre' || id == 'newList') {
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
              @media (max-width: 768px) {
                font-size: 24px;
              }
            `}
          >
            <h3>{title} 전체 보기</h3>
          </div>
          {/* 음악 데이터 박스*/}
          <div
            css={css`
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
              gap: 10px;
            `}
          >
            {latestData.map((item, index) => (
              <div>
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
                    src={item.image}
                    alt="라라"
                    css={css`
                      width: 100%;
                      border-radius: 20px;
                      display: block;
                    `}
                  />
                </button>
                <p
                  css={css`
                    font-size: 24px;
                    font-weight: 700;
                    color: white;
                    text-align: center;
                  `}
                >
                  {item.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  } else if (id === 'Popular') {
    // 인기차트 리스트 페이지 //////////////////////////////////////////////
    return (
      <div css={s_container}>
        <div
          css={css`
            display: flex;
            flex-direction: column;
            gap: 20px;
          `}
        >
          <div css={s_div_header}>
            <div css={s_div_h3}>
              <h3>인기차트</h3>
            </div>
          </div>
          <div css={s_popular_container}>
            {popularList.map((item, index) => (
              <div key={index} css={s_popular_box} onClick={() => navigate('/music/1')}>
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
                    src={item.image}
                    alt="라라"
                    css={css`
                      width: 100%;
                      height: 100%;
                      object-fit: cover;
                    `}
                  />
                </div>
                <div css={s_div_data}>
                  <h5 css={s_h5_title}>{item.name} </h5>
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
            <h3>{title} 전체 보기</h3>
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
