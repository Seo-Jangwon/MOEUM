import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {} from '../style';
import { s_container, s_image, s_imageContainer, s_textContainer } from './CardDetailListItem.style';

const CardDetailListItem = ({
  imageUrl,
  name,
  itemId,
  category,
  artist,
  replace,
  playlistid,
  playlistidx = 0,
}: {
  imageUrl: string;
  itemId: number;
  name: string;
  category: string;
  artist?: ReactNode;
  replace?: boolean;
  playlistid?: number;
  playlistidx?: number;
}) => {
  const navigate = useNavigate();
  return (
    <div
      css={s_container}
      onClick={() => {
        if (category !== 'music') navigate(`/${category}/${itemId}`, { replace });
        else {
          if (playlistid) navigate(`/music?id=${itemId}&list=${playlistid}&idx=${playlistidx}`, { replace });
          else navigate(`/music?id=${itemId}`, { replace });
        }
      }}
    >
      <div css={s_imageContainer}>
        <img css={s_image} src={imageUrl} alt="" />
      </div>
      <div css={s_textContainer}>
        <div>{name}</div>
        {artist !== null ? <div>{artist}</div> : null}
      </div>
    </div>
  );
};

export default CardDetailListItem;
