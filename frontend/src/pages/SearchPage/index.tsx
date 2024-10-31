import apiClient from '@/api/apiClient';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const testData = {
  code: 200,
  data: {
    musics: [
      {
        id: 1,
        title: 'APT.',
        albumImage: '/apt.png',
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
        albumImage: '/apt.png',
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
        albumImage: '/apt.png',
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
        albumImage: '/apt.png',
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
        albumImage: '/apt.png',
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
        albumImage: '/apt.png',
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
        albumImage: '/apt.png',
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
        title: '24K Magic',
        image: '/24k.png',
      },
      {
        id: 123,
        title: '24K Magic',
        image: '/24k.png',
      },
      {
        id: 123,
        title: '24K Magic',
        image: '/24k.png',
      },
      {
        id: 123,
        title: '24K Magic',
        image: '/24k.png',
      },
      {
        id: 123,
        title: '24K Magic',
        image: '/24k.png',
      },
      {
        id: 123,
        title: '24K Magic',
        image: '/24k.png',
      },
      {
        id: 123,
        title: '24K Magic',
        image: '/24k.png',
      },
      {
        id: 123,
        title: '24K Magic',
        image: '/24k.png',
      },
      {
        id: 123,
        title: '24K Magic',
        image: '/24k.png',
      },
    ],
    artists: [
      {
        id: 123,
        name: 'Bruno Mars',
        image: '/bruno.png',
      },
      {
        id: 123,
        name: 'Bruno Mars',
        image: '/bruno.png',
      },
      {
        id: 123,
        name: 'Bruno Mars',
        image: '/bruno.png',
      },
      {
        id: 123,
        name: 'Bruno Mars',
        image: '/bruno.png',
      },
      {
        id: 123,
        name: 'Bruno Mars',
        image: '/bruno.png',
      },
      {
        id: 123,
        name: 'Bruno Mars',
        image: '/bruno.png',
      },
      {
        id: 123,
        name: 'Bruno Mars',
        image: '/bruno.png',
      },
      {
        id: 123,
        name: 'Bruno Mars',
        image: '/bruno.png',
      },
      {
        id: 123,
        name: 'Bruno Mars',
        image: '/bruno.png',
      },
      {
        id: 123,
        name: 'Bruno Mars',
        image: '/bruno.png',
      },
    ],
    playlists: [
      {
        id: 1,
        title: '플레이리스트 1',
        image: '/apt.png',
      },
      {
        id: 1,
        title: '플레이리스트 1',
        image: '/apt.png',
      },
      {
        id: 1,
        title: '플레이리스트 1',
        image: '/apt.png',
      },
      {
        id: 1,
        title: '플레이리스트 1',
        image: '/apt.png',
      },
      {
        id: 1,
        title: '플레이리스트 1',
        image: '/apt.png',
      },
      {
        id: 1,
        title: '플레이리스트 1',
        image: '/apt.png',
      },
      {
        id: 1,
        title: '플레이리스트 1',
        image: '/apt.png',
      },
      {
        id: 1,
        title: '플레이리스트 1',
        image: '/apt.png',
      },
      {
        id: 1,
        title: '플레이리스트 1',
        image: '/apt.png',
      },
      {
        id: 1,
        title: '플레이리스트 1',
        image: '/apt.png',
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
  console.log(searchParams.get('keyword'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const musicDatas = useRef<MusicI[]>([]);
  const albumDatas = useRef<AlbumI[]>([]);
  const artistDatas = useRef<ArtistI[]>([]);
  const playListDatas = useRef<PlayListI[]>([]);
  useEffect(() => {
    apiClient({
      method: 'GET',
      url: `/musics/search`,
      params: { keyword: searchParams.get('keyword') },
    })
      .then((response) => {
        console.log(response);
        if (response.data.code === 200) {
          //   musicDatas.current = response.data.data.musics;
          //   albumDatas.current = response.data.data.albums;
          //   artistDatas.current = response.data.data.artists;
          //   playListDatas.current = response.data.data.playlists;
          setIsLoading(false);
        } else {
          alert('에러 뜸 ㅅㄱ');
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
  }, []);
  return <div>{isLoading ? <div>로딩중</div> : <div>{musicDatas.current[0].title}</div>}</div>;
};

export default SearchPage;
