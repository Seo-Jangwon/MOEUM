import { MusicI } from '..';

const MusicListItem = ({ musicList }: { musicList: MusicI[] }) => {
  return <div>{musicList[0].id}</div>;
};

export default MusicListItem;
