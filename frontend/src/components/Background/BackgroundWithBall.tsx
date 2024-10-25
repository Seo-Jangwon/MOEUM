import { s_primary_ball, s_secondary_ball } from './BackgroundWithBall.style';

const BackgroundWithBall = () => {
  return (
    <>
      <figure css={s_primary_ball} />
      <figure css={s_secondary_ball} />
    </>
  );
};

export default BackgroundWithBall;
