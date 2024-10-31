import { s_article, s_container, s_title } from './DetailCover.style';
import DetailCoverHeart from './DetailCoverHeart';

interface DetailCoverProps {
  title: string;
  cover: string;
}

const DetailCover = ({ title, cover }: DetailCoverProps) => {
  return (
    <section css={s_container(cover)}>
      <article css={s_article}>
        <h1 css={s_title}>{title}</h1>
        <DetailCoverHeart isLike={true} />
      </article>
    </section>
  );
};

export default DetailCover;
