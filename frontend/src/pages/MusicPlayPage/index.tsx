import apiClient from '@/api/apiClient';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import testData from './data.json';
import MusicPlayer from './MusicPlayer/MusicPlayer';
import PlayList from './PlayList/PlayList';
import { s_container } from './style';

export interface musicDetailInfoI {
  musicId: number;
  musicTitle: string;
  albumId: number;
  albumTitle: string;
  albumImage: string;
  albumIndex: number;
  genre: string[];
  duration: string;
  releaseData: string;
  artists: { id: number; name: string }[];
}
export interface MusicI {
  id: number;
  title: string;
  albumImage: string;
  duration: number;
  artists: { id: number; name: string }[];
}

export interface Data {
  categories: Category[];
  vibrations: any[];
  notes: Note[];
}

export interface Note {
  section: number;
  time: number;
  y: number;
  height: number;
  width: number;
  effect: string[];
  direction: number[];
  sides: number;
  angle: number;
}

export interface Category {
  defaultCategory?: number;
  category1?: number;
  category2?: number;
  category3?: number;
  category4?: number;
  category5?: number;
  category6?: number;
  category7?: number;
  category8?: number;
  category9?: number;
  category10?: number;
}

const MusicPlayPage: React.FC = () => {
  // 노래 시각화 데이터 불러오기 및 연관 플레이리스트 데이터 불러오기
  // 노래 상세 정보 불러오기
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [musicDetailInfo, setMusicDetailInfo] = useState<musicDetailInfoI>();
  const [musicListDetailInfo, setMusicListDetailInfo] = useState<MusicI[]>();
  const [searchParams] = useSearchParams();
  const [musicAnalyzedData, setMusicAnalyzedData] = useState<Data>(testData.data);
  const location = useLocation();

  const navigate = useNavigate();

  const [musicId, setMusicId] = useState<number>();
  const [listId, setListId] = useState<number>();
  const [listIdx, setListIdx] = useState<number>();

  const isFirstRendered = useRef<boolean>(true);

  //처음 재생 페이지로 왔을 경우
  useEffect(() => {
    if (!isFirstRendered.current)
      //처음 렌더링 된 게 아닐 경우
      return;
    console.log('first effect');

    setMusicId(Number(searchParams.get('id')));
    setListId(Number(searchParams.get('list')));
    setListIdx(Number(searchParams.get('idx')));
    const getMusicDetailData = async () => {
      try {
        const [musicDetailDataResponse, musicListDetailDataResponse, musicAnalyzedDataResponse] =
          await Promise.all([
            apiClient({ method: 'GET', url: `/musics/detail/music/${musicId}` }),
            listId
              ? apiClient({ method: 'GET', url: `/musics/detail/playlist/${listId}` })
              : apiClient({ method: 'GET', url: `/recommendations?musicId=${musicId}` }),
            apiClient({ method: 'GET', url: `/musics&id=${musicId}` }),
          ]);

        isFirstRendered.current = false;
        if (musicDetailDataResponse.data.code === 200) {
          setMusicDetailInfo(musicDetailDataResponse.data.data);
        } else {
          console.log('망함 ㅅㄱ');
        }
        if (musicListDetailDataResponse.data.code === 200) {
          setMusicListDetailInfo(musicListDetailDataResponse.data.data);
        } else {
          console.log('망함 ㅅㄱ');
        }
        if (musicAnalyzedDataResponse.data.code === 200) {
          setMusicAnalyzedData(musicAnalyzedDataResponse.data.data);
        } else {
          console.log('망함 ㅅㄱ!');
        }
        setIsLoading(false);
      } catch (error) {
        isFirstRendered.current = false;
        console.log(error);
        console.log('망함 ㅅㄱ!');
      }
    };
    getMusicDetailData();
  }, []);

  //location.search 추적으로 url이 바뀌었을 경우
  useEffect(() => {
    if (isFirstRendered.current) {
      //처음 렌더링 되었을 경우 패스
      return;
    }
    setIsLoading(true);

    const getMusicData_R = async () => {
      console.log('second effect');
      try {
        const currentId = Number(searchParams.get('id'));
        const currentListId = Number(searchParams.get('list'));
        const currentlistIdx = Number(searchParams.get('idx'));

        const [musicDetailDataResponse, musicListDetailDataResponse, musicAnalyzedDataResponse] =
          await Promise.all([
            musicId !== currentId
              ? apiClient({ method: 'GET', url: `/musics/detail/music/${currentId}` })
              : null,
            currentId
              ? apiClient({ method: 'GET', url: `/recommendations?musicId=${currentId}` })
              : listId !== currentListId
                ? apiClient({ method: 'GET', url: `/musics/detail/playlist/${currentListId}` })
                : null,
            musicId !== currentId
              ? apiClient({ method: 'GET', url: `/musics&id=${currentId}` })
              : null,
          ]);
        if (musicDetailDataResponse) {
          if (musicDetailDataResponse.data.code === 200) {
            setMusicDetailInfo(musicDetailDataResponse.data.data);
            setMusicId(currentId);
          } else {
            console.log('오류남 ㅅㄱ');
          }
        }
        if (musicListDetailDataResponse) {
          if (musicListDetailDataResponse.data.code === 200) {
            setMusicListDetailInfo(musicListDetailDataResponse.data.data);
            setListId(currentListId);
            setListIdx(currentlistIdx);
          } else {
            console.log('망함 ㅅㄱ!');
          }
        }
        if (musicAnalyzedDataResponse) {
          if (musicAnalyzedDataResponse.data.code === 200) {
            setMusicAnalyzedData(musicAnalyzedDataResponse.data.data);
          } else {
            console.log('망함 ㅅㄱ');
          }
        }
        setIsLoading(false);
      } catch {}
    };
    getMusicData_R();
  }, [location.search]);
  return (
    <div css={s_container}>
      <div>
        <button
          onClick={() => {
            const params = new URLSearchParams(location.search);
            params.set('id', Math.floor(Math.random() * 10).toString());
            navigate(`${location.pathname}?${params.toString()}`, { replace: true });
          }}
        >
          asdf
        </button>
      </div>
      {isLoading ? null : (
        <>
          <MusicPlayer
            musicAnalyzedData={musicAnalyzedData}
            musicDetailInfo={musicDetailInfo!}
            currentMusicId={musicId!}
            nextMusicId={musicListDetailInfo![0].id}
          />
          <PlayList
            musicData={musicListDetailInfo!}
            variant={listId ? 'playlist' : 'music'}
            listId={listId ? listId : undefined}
            listIdx={listIdx ? listIdx : undefined}
          />
        </>
      )}
    </div>
  );
};

export default MusicPlayPage;
