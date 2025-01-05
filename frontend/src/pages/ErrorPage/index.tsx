import Button from '@/components/Button/Button';
import { useNavigate } from 'react-router-dom';
import { s_errorArticle, s_errorLogo, s_errorMain } from './style';

const ErrorPage = () => {
  const navigate = useNavigate();
  return (
    <main css={s_errorMain}>
      <article css={s_errorArticle}>
        <figure>
          <img css={s_errorLogo} src="/logo.svg" alt="logo" />
        </figure>
        <h1>페이지를 찾을 수 없습니다</h1>
        <Button variant="danger" style={{ padding: '16px 32px' }} onClick={() => navigate('/')}>
          홈
        </Button>
      </article>
    </main>
  );
};

export default ErrorPage;
