import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import welcomeImg from '@/assets/Welcome.png';
import { css } from '@emotion/react';

const s_img = css`
  @keyframes fadeInBackground {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  animation: fadeInBackground 3s ease forwards;
  align-self: center;
  max-width: 100%;
`;

const WelcomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/signin');
    }, 3000);
    return () => clearTimeout(timer);
  });

  return (
    <figure css={{ display: 'flex', alignItems: 'center', height: '100%' }}>
      <img css={s_img} src={welcomeImg} alt="환영합니다." />
    </figure>
  );
};

export default WelcomePage;
