import { MusicI } from '..';

const MusicList = ({ musicList }: { musicList: MusicI[] }) => {
  return (
    <div>
      <div>노래</div>
      {musicList.length > 0 ? <div>ㅁㄴㅇㄻㄴㅇㄹ</div> : <div>등록된 노래가 없습니다.</div>}
    </div>
  );
};

export default MusicList;
