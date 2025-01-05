import Button from '@/components/Button/Button';
import { useState } from 'react';
import { s_button_send, s_input, s_main } from './styles';

interface LoginDataProps {
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isEmail?: boolean;
  onSend?: () => void;
  isPassword?: boolean;
  checkPassword?: boolean;
  passwordValue?: string;
  certification?: boolean;
  isNickname?: boolean;
  disabled?: boolean;
  onBlur?: () => void
}

const RegisterData = ({
  value,
  placeholder,
  onChange,
  isEmail = false,
  onSend,
  isPassword = false,
  checkPassword = false,
  passwordValue = '',
  certification = false,
  isNickname = false,
  disabled,
  onBlur,
}: LoginDataProps) => {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(placeholder);
  const [email] = useState(isEmail);
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [isPasswordMatch, setIsPasswordMatch] = useState(true);
  const [showIcon, setShowIcon] = useState(false);
  const [isValidInput, setIsValidInput] = useState(true);

  // 닉네임 형식
  const validateNickname = (nickname: string) => {
    const nicknameRegEx = /^(?=.*[a-z0-9가-힣])[a-z0-9가-힣]{2,16}$/;
    return nicknameRegEx.test(nickname);
  };

  // 닉네임 확인 함수
  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e);
    const nickname = e.target.value;

    if (isNickname) {
      if (nickname.length > 0) {
        const result = validateNickname(nickname);
        setIsValidInput(result);
      }
      else {
        setIsValidInput(true)
      }
    }
  };

  // 이메일 형식
  const validateEmail = (email: string) => {
    const emailRegEx =
      /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/;
    return emailRegEx.test(email);
  };

  // 이메일 확인 함수
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e);
    const email = e.target.value;

    if (isEmail) {
      const result = validateEmail(email);
      if (email.length > 0) {
        setShowIcon(result);
        setIsValidInput(result);
      } else {
        setIsValidInput(true);
      }
    }
  };

  // 비밀번호 정규식
  const validatePassword = (password: string) => {
    const reg = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/;
    return reg.test(password);
  };

  // 비밀번호 확인 함수
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e);
    const password = e.target.value;

    if (isPassword || checkPassword) {
      setShowIcon(password.length > 0);
    }

    if (isPassword) {
      const isValid = validatePassword(password);
      if (password.length > 0) {
        setIsValidPassword(isValid);
        setIsValidInput(isValid);
      } else {
        setIsValidInput(true);
      }
    }

    if (checkPassword) {
      const isMatch = password === passwordValue;
      if (password.length > 0) {
        setIsPasswordMatch(isMatch);
        setIsValidInput(isMatch);
      } else {
        setIsValidInput(true);
      }
    }
  };

  return (
    <div css={s_main}>
      <input
        maxLength={30}
        type={value}
        placeholder={currentPlaceholder}
        onChange={
          isEmail ? handleEmailChange : isNickname ? handleNicknameChange : handlePasswordChange
        }
        onFocus={() => setCurrentPlaceholder('')}
        onBlur={() => {
          setCurrentPlaceholder(placeholder);
          if (onBlur) {
            onBlur()
          }
        }}
        css={(theme) => s_input(theme, isValidInput)}
      />
      {/* 이메일 버튼 토글 */}
      <div css={s_button_send}>
        {email && showIcon && (
          <Button variant="grad" onClick={onSend} type="button" disabled={disabled}>
            전송
          </Button>
        )}
      </div>

      {/* 인증코드 확인 버튼 토글 */}
      <div css={s_button_send}>
        {certification && (
          <Button variant="grad" onClick={onSend} type="button">
            확인
          </Button>
        )}
      </div>
      <br />
    </div>
  );
};

export default RegisterData;
