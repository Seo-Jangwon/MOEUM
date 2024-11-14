import apiClient from '@/api/apiClient';
import Button from '@/components/Button/Button';
import { css } from '@emotion/react';
import { useState } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { s_content, s_error_box, s_titlebox } from '../SignInPage/style';
import RegisterData from './RegisterData/registerData';
import { s_div_signUpBox, s_from } from './styles';

const SignUpPage = () => {
  // 각 필드에 대한 상태 관리
  const [nickname, setNickname] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [certificationNumber, setCertificationNumber] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean>(false);
  const [isShow, setIsShow] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [checkPassword, setCheckPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isValidCertification, setIsValidCertification] = useState<boolean>(true);
  const [isBtnDisabled, setIsBtnDisabled] = useState<boolean>(false);

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

  const handleNicknameBlur = () => {
    if (!validateNickname(nickname) && nickname.length > 0) {
      setError('닉네임은 2~16자의 한글, 영문, 숫자로 입력해주세요.');
    } else {
      setError('');
    }
  };

  const handleEmailBlur = () => {
    if (!validateEmail(email) && email.length > 0) {
      setError('유효한 이메일 형식을 입력해주세요.');
    } else {
      setError('');
    }
  };

  const handlePasswordBlur = () => {
    if (!validatePassword(password) && password.length > 0) {
      setError('비밀번호는 8~15자, 영문, 숫자, 특수문자를 포함해야 합니다.');
    } else {
      setError('');
    }
  };

  const handleCheckPasswordBlur = () => {
    if (password !== checkPassword && checkPassword.length > 0) {
      setError('비밀번호가 일치하지 않습니다.');
    } else {
      setError('');
    }
  };

  const handleCertificationNumberBlur = () => {
    if (certificationNumber.length === 0 ) {
      setError('인증번호를 입력해주세요.');
    } else {
      setError('');
    }
  };

  // 로그인 함수
  const login = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 입력값 검증
    if (!validateNickname(nickname)) {
      alert('닉네임은 2~16자의 한글, 영문, 숫자로 입력해주세요.');
      setError('닉네임은 2~16자의 한글, 영문, 숫자로 입력해주세요.');
      return;
    }

    if (!validateEmail(email)) {
      alert('유효한 이메일 형식을 입력해주세요.');
      setError('유효한 이메일 형식을 입력해주세요.');
      return;
    }

    if (!validatePassword(password)) {
      setError('비밀번호는 8~15자, 영문, 숫자, 특수문자를 포함해야 합니다.');
      return;
    }

    if (password !== checkPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    // 모든 검증을 통과하면 다음 페이지로 이동
    console.log('닉네임:', nickname);
    console.log('이메일:', email);
    console.log('인증번호:', certificationNumber);
    console.log('비밀번호:', password);
    console.log('비밀번호 확인:', checkPassword);

    apiClient
      .post('/members/register', {
        email,
        nickname,
        password,
      })
      .then((res) => {
        console.log(res);
        if (isValid) {
          alert('모음의 회원이 되신 것을 축하드립니다.')
          navigate('/signin');
        }
      })
      .catch((err) => {
        console.log(err);
        setError('이메일 인증을 진행해 주십시오')
      });
  };

  // 인증번호 전송 함수
  const handleShowCertificationField = () => {
    if (!validateEmail(email)) {
      setError('유효한 이메일 형식을 입력해주세요.');
      return;
    }

    setIsBtnDisabled(true); 

    apiClient
      .post('/members/register/token', {
        email,
      })
      .then((res) => {
        console.log(res.data.code);
        if (res.data.code === 500) {
          setError('가입된 이메일입니다.');
        } else if (res.data.code === 200) {
          setIsShow(true);
          alert('이메일이 전송되었습니다.');
          setError('');
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setTimeout(() => {
          setIsBtnDisabled(false);
        }, 5000);
      });
  };

  // 인증번호 확인 함수
  const handleCertificationCode = () => {
    console.log('인증번호 확인');
    apiClient
      .post('/members/register/check/token', {
        email: email,
        token: certificationNumber,
      })
      .then((res) => {
        console.log(res);
        setIsValid(true);
        alert('인증에 성공했습니다.');
        setIsValidCertification(false);
        setError('');
      })
      .catch((err) => {
        console.log(err);
        setError('인증에 실패했습니다.');
        
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
          {error && (
            <div css={s_error_box}>
              <FiAlertTriangle size={24} />
              <p>{error}</p>
            </div>
          )}
        </div>

        <div css={s_div_signUpBox}>
          <RegisterData
            value={'text'}
            placeholder={'닉네임'}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNickname(e.target.value)}
            isNickname={true}
            onBlur = {handleNicknameBlur}
            
          />
          <RegisterData
            value={'email'}
            placeholder={'이메일'}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            isEmail={true}
            onSend={handleShowCertificationField}
            disabled={isBtnDisabled}
            onBlur = {handleEmailBlur}
          />
          {isShow && (
            <RegisterData
              value={'text'}
              placeholder={'인증번호 확인'}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCertificationNumber(e.target.value)
              }
              certification={isValidCertification}
              onSend={handleCertificationCode}
              onBlur = {handleCertificationNumberBlur}
            />
          )}
          <RegisterData
            value={'password'}
            placeholder={'비밀번호 (8~15자, 특수문자 포함)'}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            isPassword={true}
            onBlur = {handlePasswordBlur}
          />
          <RegisterData
            value={'password'}
            placeholder={'비밀번호 확인'}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCheckPassword(e.target.value)}
            checkPassword={true}
            passwordValue={password}
            onBlur = {handleCheckPasswordBlur}
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
