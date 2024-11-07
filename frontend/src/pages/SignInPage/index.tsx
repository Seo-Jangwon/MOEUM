import facebookLogo from '@/assets/oauth/faceboook_logo.svg';
import googleLogo from '@/assets/oauth/google_logo.svg';
import kakaoLogo from '@/assets/oauth/kakao_logo.svg';
import Button from '@/components/Button/Button';
import { Link } from 'react-router-dom';
import OauthButton from './components/OauthButton/OauthButton';
import {
  Line,
  s_container,
  s_content,
  s_form,
  s_input,
  s_line_text,
  s_links,
  s_oauth_box,
  s_titlebox,
} from './style';

const SignInPage = () => {
  // const [emailInput, setEmailInput] = useState('이메일');
  // const [passwordInput, setPasswordInput] = useState('비밀번호');

  return (
    <main css={s_container}>
      <section css={s_content}>
        <article css={s_titlebox}>
          <p css={(theme) => ({ color: theme.colors.lightgray })}>모음에 오신 걸 환영해요!</p>
          <p>당신이 어떤 사람인지 알고 싶어요.</p>
        </article>
        <form css={s_form}>
          <input css={s_input} placeholder="이메일" type="text" />
          <input css={s_input} placeholder="비밀번호" type="text" />
          <Button css={{ fontSize: 'x-large', marginTop: '24px' }} variant="grad">
            로그인
          </Button>
        </form>
        <ul css={s_links}>
          <Link to="/findpw">비밀번호 찾기</Link>|<Link to="/findid">아이디 찾기</Link>|
          <Link to="/signup">회원가입</Link>
        </ul>
      </section>
      <section css={s_oauth_box}>
        <div css={s_line_text}>
          <Line />
          <p css={{ textWrap: 'nowrap' }}>다른 방법으로 계속하기</p>
          <Line />
        </div>
        <div css={{ display: 'flex', justifyContent: 'center', gap: '32px' }}>
          <OauthButton to="/oauth/google" Icon={googleLogo} title="Google" />
          <OauthButton to="/oauth/kakao" Icon={kakaoLogo} title="Kakao" />
          <OauthButton to="/oauth/facebook" Icon={facebookLogo} title="Facebook" />
        </div>
      </section>
    </main>
  );
};

export default SignInPage;
