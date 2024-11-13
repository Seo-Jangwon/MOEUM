import { css, Theme } from '@emotion/react';
import { CiHeart } from 'react-icons/ci';
import { IoMdHeart } from 'react-icons/io';

interface DetailCoverHeartProps {
  isLike: boolean;
  size: number;
}

const s_heart = (theme: Theme) =>
  css({
    color: theme.colors.primary,
  });

const DetailCoverHeart = ({ isLike, size }: DetailCoverHeartProps) => {
  if (isLike) return <IoMdHeart size={size} css={s_heart} />;
  else return <CiHeart size={size} color="white" />;
};

export default DetailCoverHeart;
