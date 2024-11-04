import apiClient from '@/api/apiClient';
import Button from '@/components/Button/Button';
import { css } from '@emotion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { s_content, s_titlebox } from '../SignInPage/style';
import RegisterData from './RegisterData/registerData';
import { s_div_signUpBox, s_from } from './styles';

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

    const data = apiClient
      .post('/members/register', {
        email,
        nickname,
        password,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });

    navigate('/signin');
  };

  // 인증번호 전송 함수
  const handleShowCertificationField = () => {
    setIsShow(true);
    // console.log('인증번호 발송');
    const data = apiClient
      .post('/members/register/token', {
        email,
      })
      .then((res) => {
        console.log(res);
        setIsShow(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 인증번호 확인 함수
  const handleCertificationCode = () => {
    console.log('인증번호 확인');
    const data = apiClient
      .post('/members/register/check/token', {
        token: certificationNumber,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <form onSubmit={login} css={s_from}>
      <main css={s_content}>
        <div css={s_titlebox}>
          <p
            css={(theme) => css`
              color: ${theme.colors.lightgray};
            `}
          >
            모음에 오신 걸 환영해요!
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
        <div css={s_div_signUpBox}>
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
          <Button
            variant="grad"
            type="submit"
            css={{ width: '25%', height: '45px', marginTop: '25px' }}
          >
            다음
          </Button>
        </div>
      </main>
    </form>
  );
};

export default SignUpPage;
