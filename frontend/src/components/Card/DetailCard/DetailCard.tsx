import { ComponentPropsWithoutRef } from 'react';
import { s_detailCard, s_detailCardImage, s_detailCardLabel } from './DetailCard.style';

interface DetailCardProps extends ComponentPropsWithoutRef<'div'> {
  name: string;
  image: string;
}

const DetailCard = ({ name, image, ...restProps }: DetailCardProps) => {
  return (
    <div css={s_detailCard} {...restProps}>
      <img src={image} alt="image" css={s_detailCardImage} />
      {/* <IoPlay className="play-icon" css={s_detailCardPlayIcon} /> */}
      <p css={s_detailCardLabel}>{name}</p>
    </div>
  );
};

export default DetailCard;
