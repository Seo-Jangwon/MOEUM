import {
  s_container,
  s_primary_ball,
  s_secondary_ball,
  s_content,
  s_titlebox,
  s_input,
  s_form,
} from './style';
import { css } from '@emotion/react';
import { theme } from '@/styles/theme';
import Button from '@/components/Button/Button';
import Container from '@/layouts/Container';

const SignInPage = () => {
  // const [emailInput, setEmailInput] = useState('이메일');
  // const [passwordInput, setPasswordInput] = useState('비밀번호');
  return (
    <Container>
      <div css={s_container}>
        <figure css={s_primary_ball} />
        <figure css={s_secondary_ball} />
        <main css={s_content}>
          <div css={s_titlebox}>
            <p
              css={css`
                color: ${theme.colors.lightgray};
              `}
            >
              모음에 오신 걸 환영해요
            </p>
            <p>당신이 어떤 사람인지 알고 싶어요.</p>
          </div>
          <div css={s_form}>
            <input css={s_input} placeholder="이메일" type="text" />
            <input css={s_input} placeholder="비밀번호" type="text" />
          </div>
          <Button type="grad">로그인</Button>
        </main>
      </div>
    </Container>
  );
};

export default SignInPage;
