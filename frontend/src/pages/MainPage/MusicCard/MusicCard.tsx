import { s_img } from './style';

interface MusicCardProps {
  category: string;
  title: string;
  image: string;
}

const MusicCard = ({ category, title, image }: MusicCardProps) => {
  return (
    <>
      <img src={image} alt="image" css={s_img} />
    </>
  );
};

export default MusicCard;
