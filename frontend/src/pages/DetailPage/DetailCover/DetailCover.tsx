import { IoPlayCircle } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { DetailVariants } from '..';
import { s_article, s_container, s_title } from './DetailCover.style';
import DetailCoverHeart from './DetailCoverHeart';

interface DetailCoverProps {
  isLike: boolean;
  playListId: string;
  variant: DetailVariants;
  title: string;
  background: string;
  musicId?: string;
  handleLike: () => void;
}

const DetailCover = ({ isLike, playListId, variant, title, background, musicId, handleLike }: DetailCoverProps) => {
  return (
    <section css={s_container(background)}>
      <article css={s_article}>
        <h1 css={s_title}>{title}</h1>
        <div>
          {variant !== 'artist' && !!musicId && (
            <Link to={`/music?id=${musicId}&list=${playListId}`}>
              <IoPlayCircle color="white" size={48} />
            </Link>
          )}
          <button onClick={handleLike}>
            <DetailCoverHeart isLike={isLike} size={48} />
          </button>
        </div>
      </article>
    </section>
  );
};

export default DetailCover;
