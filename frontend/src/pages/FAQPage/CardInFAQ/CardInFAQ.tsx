import { css } from '@emotion/react';
import { ReactNode } from 'react';
import { s_cardContainer, s_CardImg, s_ClickedCard, s_UnClickedCard } from './style';

interface CardProps {
  iconImage: ReactNode;
  text: string;
  isClicked?: boolean;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

const CardInFAQ: React.FC<CardProps> = ({ iconImage, text, isClicked = false, onClick = null }) => {
  return (
    <div
      onClick={onClick != null ? onClick : () => {}}
      css={(theme) => css`
        ${s_cardContainer};
        ${isClicked ? s_ClickedCard(theme) : s_UnClickedCard(theme)};
      `}
    >
      <div css={s_CardImg}>{iconImage}</div>
      <div>{text}</div>
    </div>
  );
};

export default CardInFAQ;
