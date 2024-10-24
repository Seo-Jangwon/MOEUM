import Container from '@/layouts/Container';
import Button from '@/components/Button/Button';
import { useState } from 'react';
import { s_from } from './styles';
import { s_titlebox } from '../SignInPage/style';
import { theme } from '@/styles/theme';
import { css } from '@emotion/react';
import LoginData from './RegisterData/RegisterData';

const SignUpPage = () => {
  // 각 필드에 대한 상태 관리
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [certificationNumber, setCertificationNumber] = useState('');
  const [isShoow, setIsShow] = useState(false);
  const [password, setPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState('');

  // 로그인 함수
  const login = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('닉네임:', nickname);
    console.log('이메일:', email);
    console.log('인증번호', certificationNumber);
    console.log('비밀번호:', password);
    console.log('비밀번호 확인:', checkPassword);
  };

  const handleShowCertificationField = () => {
    setIsShow(true);
    console.log('인증번호 발송');
  };

  return (
    <Container>
      {/* 로그인 폼 */}

      <form onSubmit={login} css={s_from}>
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
        <LoginData
          value={'text'}
          placeholder={'닉네임'}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNickname(e.target.value)}
        />
        <LoginData
          value={'text'}
          placeholder={'이메일'}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          isEmail={true}
          onSend={handleShowCertificationField}
        />
        {isShoow && (
          <LoginData
            value={'password'}
            placeholder={'인증번호 확인'}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCertificationNumber(e.target.value)
            }
          />
        )}
        <LoginData
          value={'password'}
          placeholder={'비밀번호'}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
        />
        <LoginData
          value={'password'}
          placeholder={'비밀번호 확인'}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCheckPassword(e.target.value)}
        />
        <Button variant="grad">회원가입</Button>
      </form>
    </Container>
  );
};

export default SignUpPage;
