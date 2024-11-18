import apiClient from '@/api/apiClient';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import CardDetailListItem from './CardDetailListItem/CardDetailListItem';
import { s_container, s_titleContainer } from './style';
export type SearchDetailVariants = 'music' | 'album' | 'artist' | 'playlist';

interface SearchDetailPageProps {
  variant: SearchDetailVariants;
}

export interface MusicI {
  id: number;
  name: string;
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
  const navigate = useNavigate();
  const currentPage = useRef<number>(1);
  const observerDivRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isDataLoading = useRef<boolean>(false);
  const location = useLocation();

  const [musicDatas, setMusicDatas] = useState<MusicI[]>([]);
  function addMusicDatas(newDatas: MusicI[]) {
    setMusicDatas((prev) => [...prev, ...newDatas]);
  }
  const [notMusicDatas, setNotMusicDatas] = useState<dataI[]>([]);
  function addNotMusicDatas(newDatas: dataI[]) {
    setNotMusicDatas((prev) => [...prev, ...newDatas]);
  }

  function getMusicDatas() {
    if (isDataLoading.current) return;
    isDataLoading.current = true;
    apiClient({
      method: 'GET',
      url: `/musics/search/${variant}`,
      params: { keyword: searchParams.get('keyword'), page: currentPage.current },
    })
      .then((response) => {
        if (response.data.code === 200) {
          if (variant === 'music') {
            if (response.data.data.length > 0) {
              addMusicDatas(response.data.data);
              currentPage.current = currentPage.current + 1;
              isDataLoading.current = false;
            }
          } else {
            if (response.data.data.length > 0) {
              addNotMusicDatas(response.data.data);
              currentPage.current = currentPage.current + 1;
              isDataLoading.current = false;
            }
          }
          setIsLoading(false);
        } else {
          alert('에러 뜸 ㅅㄱ');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      () => {
        getMusicDatas();
      },
      { root: null, threshold: 1.0 },
    );
    if (observerDivRef.current) observer.observe(observerDivRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const keyword = searchParams.get('keyword');
    if (keyword === null || keyword === '') navigate('/');
    else getMusicDatas();

    return () => {
      setMusicDatas([]);
    };
  }, [location.search]);
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
      <div ref={observerDivRef} style={{ opacity: 0 }}>
        observer
      </div>
    </>
  );
};

export default SearchMorePage;
