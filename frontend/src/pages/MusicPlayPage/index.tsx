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
  audioPath: string;
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
  vibrations: { time: number; duration: number }[];
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

export interface LyricsI {
  lyrics: { times: number; lyric: string }[];
}

const MusicPlayPage: React.FC = () => {
  // 노래 시각화 데이터 불러오기 및 연관 플레이리스트 데이터 불러오기
  // 노래 상세 정보 불러오기
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [musicDetailInfo, setMusicDetailInfo] = useState<musicDetailInfoI>();
  const [musicListDetailInfo, setMusicListDetailInfo] = useState<MusicI[]>();
  const [searchParams] = useSearchParams();
  const [musicAnalyzedData, setMusicAnalyzedData] = useState<Data>(testData.data);
  const [lyricsData, setLylicsData] = useState<LyricsI>();
  const location = useLocation();

  const navigate = useNavigate();

  const musicId = useRef<number | null>();
  const playListId = useRef<number | null>();
  const playListIdx = useRef<number | null>();

  //처음 재생 페이지로 왔을 경우
  useEffect(() => {
    const getMusicDetailData = async () => {
      const queryString: (string | null)[] = [
        searchParams.get('id'),
        searchParams.get('list'),
        searchParams.get('idx'),
      ];
      queryString.forEach((s_item) => {
        console.log(s_item);
      });
      if (queryString[0]) musicId.current = parseInt(queryString[0]);
      else {
        navigate('/');
        return;
      }
      if (queryString[1]) playListId.current = parseInt(queryString[1]);
      else playListId.current = null;
      if (queryString[2]) playListIdx.current = parseInt(queryString[2]);
      else playListIdx.current = null;
      try {
        const [
          musicDetailDataResponse,
          musicListDetailDataResponse,
          musicAnalyzedDataResponse,
          musicLyricsDataResponse,
        ] = await Promise.all([
          apiClient({ method: 'GET', url: `/musics/detail/music/${musicId.current}` }),
          playListId.current
            ? apiClient({ method: 'GET', url: `/musics/playlist/detail/${playListId.current}` })
            : apiClient({ method: 'GET', url: `/recommendations?musicId=${musicId.current}` }),
          apiClient({ method: 'GET', url: `/musics/visualization/${musicId.current}` }),
          apiClient({ method: 'GET', url: `/player/lyrics/${musicId.current}` }),
        ]);

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
        if (musicLyricsDataResponse.data.code === 200) {
          setLylicsData(musicLyricsDataResponse.data.data);
        } else {
          console.log('망함 ㅅㄱ');
        }
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        console.log('망함 ㅅㄱ!');
      }
    };
    getMusicDetailData();
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
            currentMusicId={musicId.current!}
            musicLyricsData={lyricsData!}
            nextMusicId={
              musicListDetailInfo!.length - 1 > playListIdx.current!
                ? musicListDetailInfo![playListIdx.current! + 1].id
                : musicListDetailInfo![0].id
            }
          />
          <PlayList
            musicData={musicListDetailInfo!}
            variant={playListId.current ? 'playlist' : 'music'}
            listId={playListId.current ? playListId.current : undefined}
            listIdx={playListIdx.current ? playListIdx.current : undefined}
          />
        </>
      )}
    </div>
  );
};

export default MusicPlayPage;
