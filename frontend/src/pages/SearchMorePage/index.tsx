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
import CardDetailListItem from './CardDetailListItem/CardDetailListItem';
import { s_container, s_titleContainer } from './style';
export type SearchDetailVariants = 'music' | 'album' | 'artist' | 'playlist';

interface SearchDetailPageProps {
  variant: SearchDetailVariants;
}

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

const SearchMorePage = ({ variant }: SearchDetailPageProps) => {
  const titleList = new Map<string, string>([
    ['music', '음악'],
    ['album', '앨범'],
    ['artist', '아티스트'],
    ['playlist', '플레이리스트'],
  ]);

  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const [musicDatas, setMusicDatas] = useState<MusicI[]>([]);
  const currentPage = useRef<number>(0);
  function addMusicDatas(newDatas: MusicI[]) {
    setMusicDatas((prev) => [...prev, ...newDatas]);
  }
  const [notMusicDatas, setNotMusicDatas] = useState<dataI[]>([]);
  function addNotMusicDatas(newDatas: dataI[]) {
    setNotMusicDatas((prev) => [...prev, ...newDatas]);
  }
  useEffect(() => {
    const keyword = searchParams.get('keyword');
    if (keyword === null || keyword === '') {
      navigate('/');
    } else {
      apiClient({
        method: 'GET',
        url: `/musics/search/${variant}`,
        params: { keyword: searchParams.get('keyword'), page: currentPage.current },
      })
        .then((response) => {
          if (response.data.code === 200) {
            if (variant === 'music') {
              addMusicDatas(response.data.data.musics);
            } else {
              addNotMusicDatas(response.data.data[variant + 's']);
            }
            setIsLoading(false);
          } else {
            //alert('에러 뜸 ㅅㄱ');
            if (variant === 'music') {
              addMusicDatas(testData.data.musics);
            } else {
              addNotMusicDatas(testData.data.artists);
            }
            setIsLoading(false);
          }
          currentPage.current = currentPage.current + 1;
        })
        .catch((err) => {
          console.log(err);

          if (variant === 'music') {
            addMusicDatas(testData.data.musics);
          } else {
            addNotMusicDatas(testData.data.artists);
          }
          setIsLoading(false);
        });
    }
  }, []);
  return (
    <>
      <div css={s_titleContainer}>{titleList.get(variant)}</div>
      {isLoading ? (
        <div>로딩중</div>
      ) : (
        <div css={s_container}>
          {variant === 'music' ? (
            <>
              {musicDatas.map((item, index) => {
                return (
                  <CardDetailListItem
                    category="music"
                    imageUrl={item.albumImage}
                    itemId={item.id}
                    name={item.title}
                    artist={
                      <>
                        {item.artists.map((artist, idx) => (
                          <span
                            style={{ paddingRight: '5px' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log(artist.id);
                              navigate(`/artist/${artist.id}}`);
                            }}
                            key={idx}
                          >
                            {artist.name}
                          </span>
                        ))}
                      </>
                    }
                    key={index}
                  />
                );
              })}
            </>
          ) : (
            <>
              {notMusicDatas.map((item, index) => {
                return (
                  <CardDetailListItem
                    category="artist"
                    itemId={item.id}
                    imageUrl={item.image}
                    name={item.name}
                    key={index}
                  />
                );
              })}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default SearchMorePage;
