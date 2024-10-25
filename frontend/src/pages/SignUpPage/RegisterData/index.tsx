import { useState } from 'react';
import { s_input, s_button_send, s_main, s_icon_yes, s_icon_no } from './styles';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { FaRegCircleXmark } from 'react-icons/fa6';
import Button from '@/components/Button/Button';
import { css } from '@emotion/react';

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
}: LoginDataProps) => {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(placeholder);
  const [email] = useState(isEmail);
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [isPasswordMatch, setIsPasswordMatch] = useState(false);
  const [isPasswordMatch, setIsPasswordMatch] = useState(false);
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
      const result = validateNickname(nickname);
      setIsValidInput(result);
      // `alert` 제거
    }
  };

  // 이메일 형식
  const validateEmail = (email: string) => {
    const emailRegEx =
      /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/;
    return emailRegEx.test(email);
  };

  // 이메일 확인 함수
  // 이메일 확인 함수
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e);
    onChange(e);
    const email = e.target.value;

    if (isEmail) {
      const result = validateEmail(email);
      setShowIcon(result);
      setIsValidInput(result);
      // `alert` 제거
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
      setIsValidPassword(isValid);
      setIsValidInput(isValid);
      // `alert` 제거
    }

    if (checkPassword) {
      const isMatch = password === passwordValue;
      setIsPasswordMatch(isMatch);
      setIsValidInput(isMatch);
      // `alert` 제거
    }
  };

  return (
    <div css={s_main}>
    <div css={s_main}>
      <input
        maxLength={30}
        type={value}
        placeholder={currentPlaceholder}
        onChange={
          isEmail ? handleEmailChange : isNickname ? handleNicknameChange : handlePasswordChange
        }
        onFocus={() => setCurrentPlaceholder('')}
        onBlur={() => setCurrentPlaceholder(placeholder)}
        css={(theme) => s_input(theme, isValidInput)}
      />
      {/* 이메일 버튼 토글 */}
      <div css={s_button_send}>
        {email && showIcon && (
          <Button variant="grad" onClick={onSend} type='button'>
            전송
          </Button>
        )}
      </div>

      {/* 인증코드 확인 버튼 토글 */}
      <div css={s_button_send}>
        {certification && (
          <Button variant="grad" onClick={onSend} type='button'>
            확인
          </Button>
        )}
      </div>

      {/* 비밀번호 정규식 확인 토글 */}
      {isPassword && showIcon && (
        <span>
          {isValidPassword ? (
            <IoMdCheckmarkCircleOutline css={s_icon_yes} />
          ) : (
            <FaRegCircleXmark css={s_icon_no} />
          )}
        </span>
      )}

      {/* 비밀번호 일치 확인 토글 */}
      {checkPassword && showIcon && (
        <span>
          {isPasswordMatch ? (
            <IoMdCheckmarkCircleOutline css={s_icon_yes} />
          ) : (
            <FaRegCircleXmark css={s_icon_no} />
          )}
        </span>
      )}
      <br />
    </div>
    </div>
  );
};

export default RegisterData;
