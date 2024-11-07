import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {} from '../style';
import {
  s_container,
  s_image,
  s_imageContainer,
  s_textContainer,
} from './CardDetailListItem.style';

const CardDetailListItem = ({
  imageUrl,
  name,
  itemId,
  category,
  artist,
}: {
  imageUrl: string;
  itemId: number;
  name: string;
  category: string;
  artist?: ReactNode;
}) => {
  const navigate = useNavigate();
  return (
    <div
      css={s_container}
      onClick={() => {
        navigate(`/${category}/${itemId}`);
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
