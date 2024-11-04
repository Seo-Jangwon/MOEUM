import React, { useEffect } from 'react';
import { testData } from '../SearchMorePage';
import MusicPlayer from './MusicPlayer/MusicPlayer';
import PlayList from './PlayList/PlayList';
import { s_container } from './style';

const MusicPlayPage: React.FC = () => {
  // 노래 시각화 데이터 불러오기 및 연관 플레이리스트 데이터 불러오기
  // 노래 상세 정보 불러오기
  useEffect(() => {}, []);
  return (
    <>
      <div css={s_container}>
        <div></div>
        <MusicPlayer />
        <PlayList musicData={testData.data.musics} />
      </div>
    </>
  );
};

export default MusicPlayPage;
