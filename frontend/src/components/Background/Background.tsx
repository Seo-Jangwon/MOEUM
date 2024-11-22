import * as S from './Background.style';

export type BallType = 'contain' | 'clip';

interface BackgroundProps {
  ball?: BallType;
}

const Background = ({ ball }: BackgroundProps) => {
  if (!ball) return null;
  return (
    <>
      <S.PrimaryBall ball={ball} />
      <S.SecondaryBall ball={ball} />
    </>
  );
};

export default Background;
