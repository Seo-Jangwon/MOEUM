import useFetchDetail from '@/hooks/useFetchDetail';
import Flex from '@/layouts/Wrapper/Flex';
import { useParams } from 'react-router-dom';
import DetailCardList from './DetailCardList/DetailCardList';
import DetailCover from './DetailCover/DetailCover';
import DetailList from './DetailList/DetailList';
import { s_container } from './style';

export type DetailVariants = 'album' | 'artist';

interface DetailPageProps {
  variant: DetailVariants;
}

// const getVariant = (param: variant) => {
//   switch (param) {
//     case 'artist':
//       return {
//         detailCover: <DetailCover />,
//         detailList: <DetailList title="인기곡" />,
//         detailCardList: <DetailCardList />,
//       };
//     case 'album':
//       return {
//         detailCover: <DetailCover />,
//         detailList: <DetailList title="인기곡" />,
//         detailCardList: <DetailCardList />,
//       };
//   }
// };

// 데이터 받아와서 가공하기

const DetailPage = ({ variant }: DetailPageProps) => {
  const { id } = useParams();
  const detailData = useFetchDetail(variant, id!);
  return (
    <Flex>
      <main css={s_container}>
        <DetailCover title={detailData!.coverTitle} background={detailData!.image} />
        <DetailList title={detailData!.listType as string} data={detailData!.listData} />
        <DetailCardList />
      </main>
    </Flex>
  );
};

export default DetailPage;
