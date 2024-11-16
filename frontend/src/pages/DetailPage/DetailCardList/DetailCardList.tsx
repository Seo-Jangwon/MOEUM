import DetailCard from '@/components/Card/DetailCard/DetailCard';
import { CardListData } from '@/types/detailTypes';
import { s_cardWrapper, s_container, s_heading, s_title } from '../DetailList/DetailList.style';

interface DetailCardList {
  title: string;
  data: CardListData[];
}

const DetailCardList = ({ title, data }: DetailCardList) => {
  return (
    <section css={s_container}>
      <article css={s_heading}>
        <h1 css={s_title}>{title}</h1>
      </article>
      <div css={s_cardWrapper}>
        {data.map((el) => (
          <DetailCard key={el.id} {...el} />
        ))}
      </div>
    </section>
  );
};

export default DetailCardList;
