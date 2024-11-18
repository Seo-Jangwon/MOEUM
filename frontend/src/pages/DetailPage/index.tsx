import apiClient from '@/api/apiClient';
import useGetDetailByQuery from '@/hooks/useGetDetailByQuery';
import Flex from '@/layouts/Wrapper/Flex';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Navigate, useParams } from 'react-router-dom';
import DetailCardList from './DetailCardList/DetailCardList';
import DetailCover from './DetailCover/DetailCover';
import DetailList from './DetailList/DetailList';
import { s_container } from './style';

export type DetailVariants = 'album' | 'artist' | 'playlist';

interface DetailPageProps {
  variant: DetailVariants;
}

const DetailPage = ({ variant }: DetailPageProps) => {
  const { id } = useParams();
  const { isPending, isError, data } = useGetDetailByQuery(variant, id!);
  const queryClient = useQueryClient();
  const onSuccess = () => queryClient.invalidateQueries({ queryKey: ['detail'] });

  const like = useMutation({
    mutationFn: () => apiClient.post(`/musics/${variant}/like`, { id }),
    onSuccess,
  });

  const unlike = useMutation({
    mutationFn: () => apiClient.delete(`/musics/${variant}/like`),
    onSuccess,
  });

  const handleLike = () => {
    if (data?.isLike) {
      unlike.mutate();
      return;
    }
    like.mutate();
  };

  if (isPending) return null;
  if (isError) return <Navigate to="/notfound" />;
  return (
    <Flex>
      <main css={s_container}>
        <DetailCover
          isLike={data!.isLike}
          musicId={!data.listData.length ? undefined : data!.listData[0].id}
          handleLike={handleLike}
          playListId={id!}
          variant={variant}
          title={data!.coverTitle}
          background={data!.image}
        />
        <DetailList title={data!.listTitle as string} data={data!.listData} totalDuration={data!.totalDuration} />
        {!!data?.cardListData?.length && (
          <DetailCardList variant={variant} title={data.cardListTitle} data={data.cardListData} />
        )}
      </main>
    </Flex>
  );
};

export default DetailPage;
