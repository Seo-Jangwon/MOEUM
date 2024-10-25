import { css } from '@emotion/react';
import { CardClicked, CardDiv, CardImg, CardUnClicked } from './style';

interface CardProps {
  imgUrl: string;
  text: string;
  isClicked?: boolean;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

const Card: React.FC<CardProps> = ({ imgUrl, text, isClicked = false, onClick = null }) => {
  return (
    <div
      onClick={onClick != null ? onClick : () => {}}
      css={css`
        ${CardDiv};
        ${isClicked ? CardClicked : CardUnClicked};
      `}
    >
      <img css={CardImg} src={imgUrl} alt="" />
      <div>{text}</div>
    </div>
  );
};

export default Card;
