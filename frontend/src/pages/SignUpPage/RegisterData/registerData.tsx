import { useState } from 'react';
import { s_input, s_button } from './styles';
import { css } from '@emotion/react';

interface LoginDataProps {
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isEmail?: boolean;
  onSend?: () => void;
}

const LoginData = ({ value, placeholder, onChange, isEmail, onSend }: LoginDataProps) => {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(placeholder);
  const [email] = useState(isEmail);

  return (
    <div
      css={css`
        position: relative;
      `}
    >
      <input
        type={value}
        placeholder={currentPlaceholder}
        onChange={onChange}
        onFocus={() => setCurrentPlaceholder('')}
        onBlur={() => setCurrentPlaceholder(placeholder)}
        css={s_input}
      />
      {email && (
        <button css={s_button} onClick={onSend}>
          전송
        </button>
      )}

      <br />
    </div>
  );
};

export default LoginData;
