import apiClient from '@/api/apiClient';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import CardList from './CardList/CardList';
import MusicList from './MusicList/MusicList';
import { s_container } from './style';

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

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const keyword = useRef<string>();
  const musicDatas = useRef<MusicI[]>([]);
  const albumDatas = useRef<dataI[]>([]);
  const artistDatas = useRef<dataI[]>([]);
  const playListDatas = useRef<dataI[]>([]);

  const location = useLocation();

  useEffect(() => {
    setIsLoading(true);
    const tempkeyword = searchParams.get('keyword');
    if (!tempkeyword) {
      navigate('/');
      keyword.current = undefined;
      return;
    } else {
      keyword.current = tempkeyword;
      apiClient({
        method: 'GET',
        url: `/musics/search`,
        params: { keyword: keyword.current },
      })
        .then((response) => {
          if (response.data.code === 200) {
            musicDatas.current = response.data.data.musics;
            albumDatas.current = response.data.data.albums;
            artistDatas.current = response.data.data.artists;
            playListDatas.current = response.data.data.playlists;
            setIsLoading(false);
          } else {
            alert('에러 뜸 ㅅㄱ');
            setIsLoading(false);
          }
        })
        .catch((err) => {
          alert('에러 뜸 ㅅㄱ');
          console.log(err);
        });
    }
  }, [location.search]);
  return (
    <>
      {isLoading ? (
        <div>로딩중</div>
      ) : (
        <div css={s_container}>
          <MusicList musicList={musicDatas.current} category={'music'} keyword={keyword.current!} />
          <CardList
            dataList={artistDatas.current}
            category="아티스트"
            clickUrl="artist"
            keyword={keyword.current!}
            isBorder={true}
          />
          <CardList dataList={albumDatas.current} category="앨범" keyword={keyword.current!} clickUrl="album" />
          <CardList
            dataList={playListDatas.current}
            category="플레이리스트"
            keyword={keyword.current!}
            clickUrl="playlist"
          />
        </div>
      )}
    </>
  );
};

export default SearchPage;
