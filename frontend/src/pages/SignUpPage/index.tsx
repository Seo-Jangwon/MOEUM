import RegisterData from './RegisterData';
import Container from '@/layouts/Container';
import Button from '@/components/Button/Button';
import { useState } from 'react';
import { s_from } from './styles';
import { css } from '@emotion/react';
import { s_content, s_titlebox } from '../SignInPage/style';
import { useNavigate } from 'react-router-dom';

const SignUpPage = () => {
  // 각 필드에 대한 상태 관리
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [certificationNumber, setCertificationNumber] = useState('');
  const [isShow, setIsShow] = useState(false);
  const [password, setPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState('');

  const navigate = useNavigate();

  // 입력값 검증 함수
  const validateNickname = (nickname: string) => {
    const nicknameRegEx = /^(?=.*[a-z0-9가-힣])[a-z0-9가-힣]{2,16}$/;
    return nicknameRegEx.test(nickname);
  };

  const validateEmail = (email: string) => {
    const emailRegEx =
      /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/;
    return emailRegEx.test(email);
  };

  const validatePassword = (password: string) => {
    const reg = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/;
    return reg.test(password);
  };

  // 로그인 함수
  const login = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 입력값 검증
    if (!validateNickname(nickname)) {
      alert('닉네임은 2~16자의 한글, 영문, 숫자로 입력해주세요.');
      return;
    }

    if (!validateEmail(email)) {
      alert('유효한 이메일 형식을 입력해주세요.');
      return;
    }

    if (!validatePassword(password)) {
      alert('비밀번호는 8~15자, 영문, 숫자, 특수문자를 포함해야 합니다.');
      return;
    }

    if (password !== checkPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    // 모든 검증을 통과하면 다음 페이지로 이동
    console.log('닉네임:', nickname);
    console.log('이메일:', email);
    console.log('인증번호:', certificationNumber);
    console.log('비밀번호:', password);
    console.log('비밀번호 확인:', checkPassword);

    navigate('/signin');
  };

  // 인증번호 전송 함수
  const handleShowCertificationField = () => {
    setIsShow(true);
    console.log('인증번호 발송');
  };

  // 인증번호 확인 함수
  const handleCertificationCode = () => {
    console.log('인증번호 확인');
  };

  return (
    <Container>
      {/* 로그인 폼 */}
      <form onSubmit={login} css={s_from}>
        <main css={s_content}>
          <div css={s_titlebox}>
            <p
              css={(theme) => css`
                color: ${theme.colors.lightgray};
              `}
            >
              모음에 오신 걸 환영해요
            </p>
            <p
              css={(theme) => css`
                color: ${theme.colors.white};
                margin-bottom: 20px;
              `}
            >
              당신이 어떤 사람인지 알고 싶어요.
            </p>
          </div>
          <RegisterData
            value={'text'}
            placeholder={'닉네임'}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNickname(e.target.value)}
            isNickname={true}
          />
          <RegisterData
            value={'email'}
            placeholder={'이메일'}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            isEmail={true}
            onSend={handleShowCertificationField}
          />
          {isShow && (
            <RegisterData
              value={'text'}
              placeholder={'인증번호 확인'}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCertificationNumber(e.target.value)
              }
              certification={true}
              onSend={handleCertificationCode}
            />
          )}
          <RegisterData
            value={'password'}
            placeholder={'비밀번호 (8~15자, 특수문자 포함)'}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            isPassword={true}
          />
          <RegisterData
            value={'password'}
            placeholder={'비밀번호 확인'}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCheckPassword(e.target.value)}
            checkPassword={true}
            passwordValue={password}
          />
          <Button variant="grad">다음</Button>
        </main>
      </form>
    </Container>
  );
};

export default SignUpPage;
