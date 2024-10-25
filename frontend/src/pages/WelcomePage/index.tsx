import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import welcomPage from './Welcome.png';
import { useSpring, animated } from 'react-spring';

const WelcomePage = () => {
  const navigate = useNavigate();

  const [styles, api] = useSpring(() => ({
    opacity: 0,
  }));

  useEffect(() => {
    api.start({ opacity: 1 });

    const timer = setTimeout(() => {
      api.start({
        opacity: 0,
        onRest: () => {
          navigate('/signin');
        },
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [api, navigate]);

  return (
    <animated.div style={styles}>
      <img src={welcomPage} alt="환영합니다." style={{ maxWidth: '100%' }} />
    </animated.div>
  );
};

export default WelcomePage;
