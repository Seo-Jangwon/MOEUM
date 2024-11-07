import { css, Theme } from '@emotion/react';
import { IoMdHeart } from 'react-icons/io';
import { CiHeart } from "react-icons/ci";

interface DetailCoverHeartProps {
  isLike: boolean;
}

const s_heart = (theme: Theme) =>
  css({
    color: theme.colors.primary,
  });

const DetailCoverHeart = ({ isLike }: DetailCoverHeartProps) => {
  if (isLike) return <IoMdHeart size={48} css={s_heart} />;
  else return (
    <CiHeart size={48} color='white' />
  )
};

export default DetailCoverHeart;
