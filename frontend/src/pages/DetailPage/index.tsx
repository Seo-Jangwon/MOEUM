import useFetchDetail from '@/hooks/useFetchDetail';
import Flex from '@/layouts/Wrapper/Flex';
import { useParams } from 'react-router-dom';
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
  const { isPending, isError, data, error, isSuccess } = useFetchDetail(variant, id!);
  if (isPending) {
    console.log('loading');
    return null;
  }
  if (isError) {
    console.log(error?.message);
    return null;
  }
  return (
    <Flex>
      <main css={s_container}>
        <DetailCover title={data!.coverTitle} background={data!.image} />
        <DetailList title={data!.listTitle as string} data={data!.listData} />
        {!!data?.cardListData?.length && <DetailCardList title={data.cardListTitle} data={data.cardListData} />}
      </main>
    </Flex>
  );
};

export default DetailPage;
