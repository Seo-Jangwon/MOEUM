import useFetchDetail from '@/hooks/useFetchDetail';
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
    <div css={s_container}>
      <DetailCover title={detailData?.coverTitle as string} cover={detailData?.image as string} />
      <DetailCover title={detailData?.coverTitle as string} cover={detailData?.image as string} />
      <DetailCover title={detailData?.coverTitle as string} cover={detailData?.image as string} />
      <DetailCover title={detailData?.coverTitle as string} cover={detailData?.image as string} />
      <DetailCover title={detailData?.coverTitle as string} cover={detailData?.image as string} />
      <DetailCover title={detailData?.coverTitle as string} cover={detailData?.image as string} />
      <DetailList title={detailData?.listType as string} />
      <DetailCardList />
    </div>
  );
};

export default DetailPage;
