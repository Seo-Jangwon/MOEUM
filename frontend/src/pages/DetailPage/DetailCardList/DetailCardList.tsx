import DetailCard from '@/components/Card/DetailCard/DetailCard';
import { CardListData } from '@/types/detailTypes';
import { useNavigate } from 'react-router-dom';
import { DetailVariants } from '..';
import { s_cardWrapper, s_container, s_heading, s_title } from '../DetailList/DetailList.style';

interface DetailCardList {
  variant: DetailVariants;
  title: string;
  data: CardListData[];
}

const getNavigatePath = (variant: DetailVariants) => {
  switch (variant) {
    case 'album':
      return 'artist';
    case 'artist':
      return 'album';
  }
};

const DetailCardList = ({ title, data, variant }: DetailCardList) => {
  const navigate = useNavigate();
  const handleClick = (id: string) => {
    navigate(`/${getNavigatePath(variant)}/${id}`);
  };
  return (
    <section css={s_container}>
      <article css={s_heading}>
        <h1 css={s_title}>{title}</h1>
      </article>
      <div css={s_cardWrapper}>
        {data.map((el) => (
          <DetailCard key={el.id} {...el} onClick={() => handleClick(el.id)} />
        ))}
      </div>
    </section>
  );
};

export default DetailCardList;
