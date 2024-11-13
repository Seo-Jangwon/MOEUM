import apiClient from '@/api/apiClient';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import testImage1 from '../../assets/lalaticon/lala1.png';
import testImage2 from '../../assets/lalaticon/lala2.png';
import testImage3 from '../../assets/lalaticon/lala3.png';
import testImage4 from '../../assets/lalaticon/lala4.png';
import testImage5 from '../../assets/lalaticon/lala5.png';
import testImage6 from '../../assets/lalaticon/lala6.png';
import testImage7 from '../../assets/lalaticon/lala7.png';
import testImage8 from '../../assets/lalaticon/lala8.png';
import testImage9 from '../../assets/lalaticon/lala9.png';
import CardList from './CardList/CardList';
import MusicList from './MusicList/MusicList';
import { s_container } from './style';

const testData = {
  code: 200,
  data: {
    musics: [
      {
        id: 1,
        title: 'APT.',
        albumImage: testImage1,
        artists: [
          {
            id: 123,
            name: 'Bruno Mars',
          },
          {
            id: 124,
            name: '로제 (ROSÉ)',
          },
        ],
      },
      {
        id: 1,
        title: 'APT.',
        albumImage: testImage2,
        artists: [
          {
            id: 123,
            name: 'Bruno Mars',
          },
          {
            id: 124,
            name: '로제 (ROSÉ)',
          },
        ],
      },
      {
        id: 1,
        title: 'APT.',
        albumImage: testImage3,
        artists: [
          {
            id: 123,
            name: 'Bruno Mars',
          },
          {
            id: 124,
            name: '로제 (ROSÉ)',
          },
        ],
      },
      {
        id: 1,
        title: 'APT.',
        albumImage: testImage4,
        artists: [
          {
            id: 123,
            name: 'Bruno Mars',
          },
          {
            id: 124,
            name: '로제 (ROSÉ)',
          },
        ],
      },
      {
        id: 1,
        title: 'APT.',
        albumImage: testImage5,
        artists: [
          {
            id: 123,
            name: 'Bruno Mars',
          },
          {
            id: 124,
            name: '로제 (ROSÉ)',
          },
        ],
      },
    ],
    albums: [
      {
        id: 123,
        name: '24K Magic',
        image: testImage6,
      },
      {
        id: 123,
        name: '24K Magic',
        image: testImage7,
      },
      {
        id: 123,
        name: '24K Magic',
        image: testImage8,
      },
      {
        id: 123,
        name: '24K Magic',
        image: testImage9,
      },
      {
        id: 123,
        name: '24K Magic',
        image: testImage1,
      },
      {
        id: 123,
        name: '24K Magic',
        image: testImage2,
      },
      {
        id: 123,
        name: '24K Magic',
        image: testImage3,
      },
      {
        id: 123,
        name: '24K Magic',
        image: testImage4,
      },
      {
        id: 123,
        name: '24K Magic',
        image: testImage5,
      },
    ],
    artists: [
      {
        id: 123,
        name: 'Bruno Mars',
        image: testImage6,
      },
      {
        id: 123,
        name: 'Bruno Mars',
        image: testImage7,
      },
      {
        id: 123,
        name: 'Bruno Mars',
        image: testImage8,
      },
      {
        id: 123,
        name: 'Bruno Mars',
        image: testImage9,
      },
      {
        id: 123,
        name: 'Bruno Mars',
        image: testImage1,
      },
      {
        id: 123,
        name: 'Bruno Mars',
        image: testImage2,
      },
      {
        id: 123,
        name: 'Bruno Mars',
        image: testImage3,
      },
      {
        id: 123,
        name: 'Bruno Mars',
        image: testImage4,
      },
      {
        id: 123,
        name: 'Bruno Mars',
        image: testImage5,
      },
      {
        id: 123,
        name: 'Bruno Mars',
        image: testImage6,
      },
    ],
    playlists: [
      {
        id: 1,
        name: '플레이리스트 1',
        image: testImage7,
      },
      {
        id: 1,
        name: '플레이리스트 1',
        image: testImage8,
      },
      {
        id: 1,
        name: '플레이리스트 1',
        image: testImage9,
      },
      {
        id: 1,
        name: '플레이리스트 1',
        image: testImage1,
      },
      {
        id: 1,
        name: '플레이리스트 1',
        image: testImage2,
      },
      {
        id: 1,
        name: '플레이리스트 1',
        image: testImage3,
      },
      {
        id: 1,
        name: '플레이리스트 1',
        image: testImage4,
      },
      {
        id: 1,
        name: '플레이리스트 1',
        image: testImage5,
      },
      {
        id: 1,
        name: '플레이리스트 1',
        image: testImage6,
      },
      {
        id: 1,
        name: '플레이리스트 1',
        image: testImage7,
      },
    ],
  },
};

export interface MusicI {
  id: number;
  title: string;
  albumImage: string;
  artists: { id: number; name: string }[];
}

export interface dataI {
  id: number;
  name: string;
  image: string;
}

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const keyword = searchParams.get('keyword');
  const musicDatas = useRef<MusicI[]>([]);
  const albumDatas = useRef<dataI[]>([]);
  const artistDatas = useRef<dataI[]>([]);
  const playListDatas = useRef<dataI[]>([]);
  useEffect(() => {
    if (keyword === null || keyword === '') {
      navigate('/');
    } else {
      apiClient({
        method: 'GET',
        url: `/musics/search`,
        params: { keyword },
      })
        .then((response) => {
          if (response.data.code === 200) {
            //   musicDatas.current = response.data.data.musics;
            //   albumDatas.current = response.data.data.albums;
            //   artistDatas.current = response.data.data.artists;
            //   playListDatas.current = response.data.data.playlists;
            setIsLoading(false);
          } else {
            //alert('에러 뜸 ㅅㄱ');
            musicDatas.current = testData.data.musics;
            albumDatas.current = testData.data.albums;
            artistDatas.current = testData.data.artists;
            playListDatas.current = testData.data.playlists;
            setIsLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
          musicDatas.current = testData.data.musics;
          albumDatas.current = testData.data.albums;
          artistDatas.current = testData.data.artists;
          playListDatas.current = testData.data.playlists;
          setIsLoading(false);
        });
    }
  }, []);
  return (
    <>
      {isLoading ? (
        <div>로딩중</div>
      ) : (
        <div css={s_container}>
          <MusicList
            musicList={musicDatas.current}
            category={'music'}
            keyword={keyword !== null ? keyword : ''}
          />
          <CardList
            dataList={artistDatas.current}
            category="아티스트"
            clickUrl="artist"
            keyword={keyword !== null ? keyword : ''}
            isBorder={true}
          />
          <CardList
            dataList={artistDatas.current}
            category="앨범"
            keyword={keyword !== null ? keyword : ''}
            clickUrl="album"
          />
          <CardList
            dataList={artistDatas.current}
            category="플레이리스트"
            keyword={keyword !== null ? keyword : ''}
            clickUrl="playlist"
          />
        </div>
      )}
    </>
  );
};

export default SearchPage;