import * as S from './Background.style';

interface BackgroundProps {
  ball?: 'contain' | 'clip';
}

const Background = ({ ball }: BackgroundProps) => {
  return (
    <S.Container>
      {Boolean(ball) && (
        <>
          <S.PrimaryBall />
          <S.SecondaryBall />
        </>
      )}
    </S.Container>
  );
};

export default Background;
