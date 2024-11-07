import { css } from '@emotion/react';
import { ComponentPropsWithoutRef } from 'react';
import { IoPlay } from 'react-icons/io5';
import { s_button, s_icon, s_img } from './style';

interface MusicCardProps extends ComponentPropsWithoutRef<'button'> {
  category: string;
  title: string;
  image: string;
}

const MusicCard = ({ category, title, image, ...restProps }: MusicCardProps) => {
  return (
    <>
      <button css={s_button} {...restProps}>
        <img src={image} alt="image" css={s_img} />
        <IoPlay className="play-icon" css={s_icon} />
      </button>
      <p
        css={css`
          font-size: 16px;
          padding: 4px;
        `}
      >
        {title}
      </p>
    </>
  );
};

export default MusicCard;
