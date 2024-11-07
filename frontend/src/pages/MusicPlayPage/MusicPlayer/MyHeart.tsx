import apiClient from '@/api/apiClient';
import { css, Theme } from '@emotion/react';
import { CiHeart } from 'react-icons/ci';
import { IoMdHeart } from 'react-icons/io';

interface MyHeartProps {
  isLike: boolean;
  size: number;
  id: number;
  category: 'music' | 'artist' | 'album' | 'playlist';
}

const s_heart = (theme: Theme) =>
  css({
    color: theme.colors.primary,
  });

const MyHeart = ({ size, isLike, id, category }: MyHeartProps) => {
  function changeHeartState() {
    apiClient({ method: isLike ? 'DELETE' : 'POST', url: `/musics/${category}/like`, data: { id } })
      .then((response) => {
        if (response.data.code === 200) {
          console.log('goood');
        }
      })
      .catch((err) => {
        console.log('에러남 ㅅㄱ');
        console.log(err);
      });
  }
  return isLike ? (
    <IoMdHeart size={size} css={s_heart} onClick={changeHeartState} />
  ) : (
    <CiHeart size={size} color="white" onClick={changeHeartState} />
  );
};

export default MyHeart;
