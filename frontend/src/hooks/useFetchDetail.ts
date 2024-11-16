import apiClient from '@/api/apiClient';
import { DetailVariants } from '@/pages/DetailPage';
import { Detail } from '@/types/detailTypes';
import { useQuery } from '@tanstack/react-query';

const TITLE_BY_VARIANTS = {
  album: { listTitle: '수록곡', cardListTitle: '아티스트' },
  artist: { listTitle: '인기곡', cardListTitle: '디스코그래피' },
  playlist: { listTitle: '플레이리스트' },
};

const useFetchDetail = (variant: DetailVariants, id: string) => {
  const { isPending, isError, data, error, isSuccess } = useQuery({
    queryKey: ['detail', variant, id],
    queryFn: async () => {
      const { data } = (await apiClient.get(`/musics/detail/${variant}/${id}`)).data;
      const transformedData = { ...TITLE_BY_VARIANTS[variant], coverTitle: data.name, image: data.image } as Detail;

      switch (variant) {
        case 'album':
          transformedData.totalDuration = data.totalDuration;
          transformedData.listData = data.musics;
          transformedData.cardListData = data.artists;
          break;

        case 'artist':
          transformedData.listData = data.popular?.slice(0, 10).map((el: { [key: string]: string }) => ({
            id: el.id,
            name: el.musicName,
            duration: el.musicDuration,
          }));
          transformedData.cardListData = data.discography.slice(0, 5);
          break;

        case 'playlist':
          transformedData.totalDuration = data.totalDuration;
          transformedData.listData = data.musics;
          break;
      }

      return transformedData;
    },
  });

  return { isPending, isError, data, error, isSuccess };
};

export default useFetchDetail;
