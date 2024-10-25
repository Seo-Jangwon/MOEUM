import { css } from '@emotion/react';
import { s_ClickedCard, s_cardContainer, s_CardImg, s_UnClickedCard } from './style';

interface CardProps {
  imgUrl: string;
  text: string;
  isClicked?: boolean;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

const CardInFAQ: React.FC<CardProps> = ({ imgUrl, text, isClicked = false, onClick = null }) => {
  return (
    <div
      onClick={onClick != null ? onClick : () => {}}
      css={(theme) => css`
        ${s_cardContainer};
        ${isClicked ? s_ClickedCard(theme) : s_UnClickedCard(theme)};
      `}
    >
      <img css={s_CardImg} src={imgUrl} alt="" />
      <div>{text}</div>
    </div>
  );
};

export default CardInFAQ;
