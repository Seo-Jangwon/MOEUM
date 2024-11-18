import CardDetailListItem from '@/pages/SearchMorePage/CardDetailListItem/CardDetailListItem';
import { useNavigate } from 'react-router-dom';
import { MusicI } from '..';
import { s_container, s_playListTitle } from './PlayList.style';

const PlayList = ({
  musicData,
  variant,
  listId,
  listIdx,
}: {
  musicData: MusicI[];
  variant: 'music' | 'playlist';
  listId: number | undefined;
  listIdx: number | undefined;
}) => {
  const navigate = useNavigate();
  return (
    <div css={s_container}>
      
      <div css={s_playListTitle}>{variant === 'music' ? '추천곡' : '재생목록'}</div>
      {musicData.map((item, index) => {
        return (
          <CardDetailListItem
            category="music"
            imageUrl={item.albumImage}
            name={item.title}
            itemId={item.id}
            key={index}
            playlistid={listId}
            playlistidx={index}
            replace={true}
            artist={
              <>
                {item.artists.map((artist, idx) => (
                  <span
                    style={{ paddingLeft: '5px' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/artist/${artist.id}`);
                    }}
                    key={idx}
                  >
                    {artist.name}
                  </span>
                ))}
              </>
            }
          />
        );
      })}
    </div>
  );
};

export default PlayList;
