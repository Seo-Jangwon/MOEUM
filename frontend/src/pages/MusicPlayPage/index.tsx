import apiClient from '@/api/apiClient';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { default as testAnalyzedData, default as testData } from './data.json';
import testPlayListData from './listData.json';
import testLyricsData from './lyricsData.json';
import testMusicDetailInfo from './musicDetailInfo.json';
import MusicPlayer from './MusicPlayer/MusicPlayer';
import PlayList from './PlayList/PlayList';
import { s_container, s_content, s_infoContainer } from './style';

export interface musicDetailInfoI {
  musicId: number;
  musicName: string;
  albumId: number;
  albumName: string;
  albumImage: string;
  albumIndex: number;
  audioPath: string;
  genre: string[];
  duration: string;
  releaseDate: string;
  artists: { id: number; name: string }[];
}
export interface MusicI {
  id: number;
  title: string;
  albumImage: string;
  duration: string;
  artists: { id: number; name: string }[];
}

export interface Data {
  vibrations: { time: number; duration: number }[];
  notes: Note[];
  backgrounds: { start: number; end: number; color: string }[];
}

export interface Note {
  section: number;
  time: number;
  y: number;
  height: number;
  width: number;
  effect: string[];
  direction: number[];
  color: string;
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
          apiClient({ method: 'GET', url: `/musics/visualization/${musicId.current}/lyrics` }),
        ]);

        if (musicDetailDataResponse.data.code === 200) {
          setMusicDetailInfo(musicDetailDataResponse.data.data);
        } else {
          console.log('망함 ㅅㄱ');
        }
        if (musicListDetailDataResponse.data.code === 200) {
          if (playListId.current) setMusicListDetailInfo(musicListDetailDataResponse.data.data.musics.playlistMusics);
          else setMusicListDetailInfo(musicListDetailDataResponse.data.data.recommendedMusics);
        } else {
          console.log('망함 ㅅㄱ');
        }
        if (musicAnalyzedDataResponse.data.code === 200) {
          setMusicAnalyzedData(musicAnalyzedDataResponse.data.data);
          // setMusicAnalyzedData(testAnalyzedData.data);
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
        setLylicsData(testLyricsData.data);
        setMusicAnalyzedData(testAnalyzedData.data);
        setMusicDetailInfo(testMusicDetailInfo.data);
        setMusicListDetailInfo(testPlayListData.data.recommendedMusics);
        setIsLoading(false);
        console.log('망함 ㅅㄱ!');
      }
    };
    getMusicDetailData();
  }, [location.search]);

  return (
    <div css={s_container}>
      {isLoading ? null : (
        <>
          <div css={s_content}>
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
              playListId={playListId.current ? playListId.current : undefined}
              playListIdx={playListIdx.current ? playListIdx.current : undefined}
            />
            <PlayList
              musicData={musicListDetailInfo!}
              variant={playListId.current ? 'playlist' : 'music'}
              listId={playListId.current ? playListId.current : undefined}
              listIdx={playListIdx.current ? playListIdx.current : undefined}
            />
          </div>
          <div css={s_infoContainer}>
            <div className="music-title">{musicDetailInfo!.musicName}</div>
            <div className="artist-list">
              {musicDetailInfo!.artists.map((artist, index) => (
                <span key={index} className="artist" onClick={() => navigate(`/artist/${artist.id}`)}>
                  {artist.name}
                </span>
              ))}
            </div>
            <div className="release-date">발매일 : {musicDetailInfo!.releaseDate}</div>
          </div>
        </>
      )}
    </div>
  );
};

export default MusicPlayPage;
