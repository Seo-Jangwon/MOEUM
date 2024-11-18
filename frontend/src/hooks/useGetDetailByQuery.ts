import apiClient from '@/api/apiClient';
import { DetailVariants } from '@/pages/DetailPage';
import { Detail } from '@/types/detailTypes';
import { useQuery } from '@tanstack/react-query';

const TITLE_BY_VARIANTS = {
  album: { listTitle: '수록곡', cardListTitle: '아티스트' },
  artist: { listTitle: '인기곡', cardListTitle: '디스코그래피' },
  playlist: { listTitle: '플레이리스트' },
};

const getDetailApiPath = (variant: DetailVariants) => {
  return variant === 'playlist' ? `/musics/playlist/detail` : `/musics/detail/${variant}`;
};

const useGetDetailByQuery = (variant: DetailVariants, id: string) => {
  return useQuery({
    queryKey: ['detail', variant, id],
    queryFn: async () => {
      const { data } = (await apiClient.get(`${getDetailApiPath(variant)}/${id}`)).data;
      const normalizedData = { ...TITLE_BY_VARIANTS[variant], coverTitle: data.name, image: data.image } as Detail;

      switch (variant) {
        case 'album':
          normalizedData.totalDuration = data.totalDuration;
          normalizedData.listData = data.musics;
          normalizedData.cardListData = data.artists.slice(0, 5);
          normalizedData.isLike = data.isLike;
          break;

        case 'artist':
          normalizedData.listData = data.popular?.slice(0, 10).map((el: { [key: string]: string }) => ({
            id: el.id,
            name: el.musicName,
            duration: el.musicDuration,
          }));
          normalizedData.cardListData = data.discography.slice(0, 5);
          normalizedData.isLike = data.isLike;

          break;

        case 'playlist': {
          const playListData = data.musics;
          normalizedData.totalDuration = playListData.totalDuration;
          normalizedData.coverTitle = playListData.name;
          normalizedData.image = playListData.image;
          normalizedData.listData = playListData.playlistMusics.map((el: { [key: string]: string }) => ({
            id: el.id,
            name: el.title,
            duration: el.duration,
          }));
          normalizedData.isLike = playListData.isLike;
          break;
        }
      }

      return normalizedData;
    },
  });
};

export default useGetDetailByQuery;
