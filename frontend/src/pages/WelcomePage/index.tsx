import welcomeImg from '@/assets/Welcome.png';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { s_container, s_img } from './style';

const WelcomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/signin');
    }, 3000);
    return () => clearTimeout(timer);
  });

  return (
    <figure css={s_container}>
      <img css={s_img} src={welcomeImg} alt="환영합니다." />
    </figure>
  );
};

export default WelcomePage;
