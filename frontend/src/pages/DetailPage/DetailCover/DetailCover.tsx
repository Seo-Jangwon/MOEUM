import DetailCardList from '../DetailCardList/DetailCardList';
import DetailList from '../DetailList/DetailList';
import { s_article, s_container, s_title } from './DetailCover.style';
import DetailCoverHeart from './DetailCoverHeart';

interface DetailCoverProps {
  title: string;
  background: string;
}

const DetailCover = ({ title, background }: DetailCoverProps) => {
  return (
    <section css={s_container(background)}>
      <article css={s_article}>
        <h1 css={s_title}>{title}</h1>
        <DetailCoverHeart isLike={true} size={48} />
      </article>
    </section>
  );
};

export default DetailCover;
