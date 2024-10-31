import { css, Theme } from '@emotion/react';
import { IoMdHeart } from 'react-icons/io';

interface DetailCoverHeartProps {
  isLike: boolean;
}

const s_heart = (theme: Theme) =>
  css({
    color: theme.colors.primary,
  });

const DetailCoverHeart = ({ isLike }: DetailCoverHeartProps) => {
  if (isLike) return <IoMdHeart size={48} css={s_heart} />;
};

export default DetailCoverHeart;
