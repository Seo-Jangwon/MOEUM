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
  return <figure>{isLike ? <IoMdHeart size={size} css={s_heart} /> : <CiHeart size={size} color="white" />}</figure>;
};

export default DetailCoverHeart;
