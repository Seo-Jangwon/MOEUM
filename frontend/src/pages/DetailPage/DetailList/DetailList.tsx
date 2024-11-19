import { ListData } from '@/types/detailTypes';
import { s_container, s_heading, s_listContainer, s_title, s_totalInfo } from './DetailList.style';
import DetailListItem from './DetailListItem';

interface DetailListProps {
  title: string;
  data: ListData[];
  totalDuration?: string;
}

const DetailList = ({ title, data, totalDuration }: DetailListProps) => {
  return (
    <section css={s_container}>
      <article css={s_heading}>
        <h1 css={s_title}>{title}</h1>
        {totalDuration && (
          <span css={s_totalInfo}>
            {data.length}곡 · {totalDuration}
          </span>
        )}
      </article>
      <ol css={s_listContainer}>
        {data.map((el, index) => (
          <DetailListItem {...el} index={index + 1} key={el.id} />
        ))}
      </ol>
    </section>
  );
};

export default DetailList;
