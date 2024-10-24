import { useState } from 'react';
import { s_input, s_button, s_main, s_icon_yes, s_icon_no } from './styles';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { FaRegCircleXmark } from 'react-icons/fa6';
import Button from '@/components/Button/Button';

interface LoginDataProps {
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isEmail?: boolean;
  onSend?: () => void;
  isPassword?: boolean;
  checkPassword?: boolean;
  passwordValue?: string; 
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
}: LoginDataProps) => {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(placeholder);
  const [email] = useState(isEmail);
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [isPasswordMatch, setIsPasswordMatch] = useState(false); 
  const [showIcon, setShowIcon] = useState(false);

  // 이메일 형식
  const validateEmail = (email: string) => {
    const emailRegEx = /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/;
    return emailRegEx.test(email)
  }

  // 이메일 확인 함수 
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e)
    const email = e.target.value;

    if (isEmail) {
      const result = validateEmail(email)
      setShowIcon(result)
    }
  }

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
    }

    if (checkPassword) {
      setIsPasswordMatch(password === passwordValue);
    }
  };

  return (
    <main css={s_main}>
      <input
        maxLength={30}
        type={value}
        placeholder={currentPlaceholder}
        onChange={isEmail? handleEmailChange : handlePasswordChange}
        onFocus={() => setCurrentPlaceholder('')}
        onBlur={() => setCurrentPlaceholder(placeholder)}
        css={s_input}
      />

      {/* 이메일 버튼 토글 */}
      {email && showIcon &&(
        // <Button variant="grad">전송</Button>
        <button css={s_button} onClick={onSend}>
          전송
         </button>
      )}

      {/* 비밀번호 확인 토글 */}
      {isPassword && showIcon && (
        <span>
          {isValidPassword ? (
            <IoMdCheckmarkCircleOutline css={s_icon_yes} />
          ) : (
            <FaRegCircleXmark css={s_icon_no} />
          )}
        </span>
      )}

      {/* 비밀번호 확인 토글 */}
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
    </main>
  );
};

export default RegisterData;
