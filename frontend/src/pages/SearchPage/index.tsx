import apiClient from '@/api/apiClient';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CardList from './CardList/CardList';
import testImage from './i15949156695.png';
import MusicList from './MusicList/MusicList';
import { s_container } from './style';

const testData = {
  code: 200,
  data: {
    musics: [
      {
        id: 1,
        title: 'APT.',
        albumImage: testImage,
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
        albumImage: testImage,
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
        albumImage: testImage,
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
        albumImage: testImage,
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
        albumImage: testImage,
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
        image: testImage,
      },
      {
        id: 123,
        name: '24K Magic',
        image: testImage,
      },
      {
        id: 123,
        name: '24K Magic',
        image: testImage,
      },
      {
        id: 123,
        name: '24K Magic',
        image: testImage,
      },
      {
        id: 123,
        name: '24K Magic',
        image: testImage,
      },
      {
        id: 123,
        name: '24K Magic',
        image: testImage,
      },
      {
        id: 123,
        name: '24K Magic',
        image: testImage,
      },
      {
        id: 123,
        name: '24K Magic',
        image: testImage,
      },
      {
        id: 123,
        name: '24K Magic',
        image: testImage,
      },
    ],
    artists: [
      {
        id: 123,
        name: 'Bruno Mars',
        image: testImage,
      },
      {
        id: 123,
        name: 'Bruno Mars',
        image: testImage,
      },
      {
        id: 123,
        name: 'Bruno Mars',
        image: testImage,
      },
      {
        id: 123,
        name: 'Bruno Mars',
        image: testImage,
      },
      {
        id: 123,
        name: 'Bruno Mars',
        image: testImage,
      },
      {
        id: 123,
        name: 'Bruno Mars',
        image: testImage,
      },
      {
        id: 123,
        name: 'Bruno Mars',
        image: testImage,
      },
      {
        id: 123,
        name: 'Bruno Mars',
        image: testImage,
      },
      {
        id: 123,
        name: 'Bruno Mars',
        image: testImage,
      },
      {
        id: 123,
        name: 'Bruno Mars',
        image: testImage,
      },
    ],
    playlists: [
      {
        id: 1,
        name: '플레이리스트 1',
        image: testImage,
      },
      {
        id: 1,
        name: '플레이리스트 1',
        image: testImage,
      },
      {
        id: 1,
        name: '플레이리스트 1',
        image: testImage,
      },
      {
        id: 1,
        name: '플레이리스트 1',
        image: testImage,
      },
      {
        id: 1,
        name: '플레이리스트 1',
        image: testImage,
      },
      {
        id: 1,
        name: '플레이리스트 1',
        image: testImage,
      },
      {
        id: 1,
        name: '플레이리스트 1',
        image: testImage,
      },
      {
        id: 1,
        name: '플레이리스트 1',
        image: testImage,
      },
      {
        id: 1,
        name: '플레이리스트 1',
        image: testImage,
      },
      {
        id: 1,
        name: '플레이리스트 1',
        image: testImage,
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

export interface AlbumI {
  id: number;
  title: string;
  image: string;
}

export interface ArtistI {
  id: number;
  name: string;
  image: string;
}

export interface PlayListI {
  id: number;
  title: string;
  image: string;
}

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const musicDatas = useRef<MusicI[]>([]);
  const albumDatas = useRef<dataI[]>([]);
  const artistDatas = useRef<dataI[]>([]);
  const playListDatas = useRef<dataI[]>([]);
  useEffect(() => {
    const keyword = searchParams.get('keyword');
    if (keyword === null || keyword === '') {
      navigate('/');
    } else {
      apiClient({
        method: 'GET',
        url: `/musics/search`,
        params: { keyword: searchParams.get('keyword') },
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
          <MusicList musicList={musicDatas.current} />
          <CardList
            dataList={artistDatas.current}
            category="아티스트"
            clickUrl="artist"
            isBorder={true}
          />
          <CardList dataList={artistDatas.current} category="앨범" clickUrl="album" />
          <CardList dataList={artistDatas.current} category="플레이리스트" clickUrl="playlist" />
        </div>
      )}
    </>
  );
};

export default SearchPage;
