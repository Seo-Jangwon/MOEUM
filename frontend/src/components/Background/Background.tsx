import * as S from './Background.style';

export type BallType = 'contain' | 'clip';

interface BackgroundProps {
  ball?: BallType;
}

const Background = ({ ball }: BackgroundProps) => {
  return (
    <S.Container>
      {!!ball && (
        <>
          <S.PrimaryBall ball={ball} />
          <S.SecondaryBall ball={ball} />
        </>
      )}
    </S.Container>
  );
};

export default Background;
