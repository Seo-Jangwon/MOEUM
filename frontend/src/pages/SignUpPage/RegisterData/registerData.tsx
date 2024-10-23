import { css } from "@emotion/react";
import { useState } from "react";

interface LoginDataProps {
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const LoginData = ({ value, placeholder, onChange }: LoginDataProps) => {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(placeholder);

  return (
    <>
      <input
        type={value}
        placeholder={currentPlaceholder}
        onChange={onChange}
        onFocus={() => setCurrentPlaceholder("")} 
        onBlur={() => setCurrentPlaceholder(placeholder)} 
        css={css`
          width: 490px;
          height: 53px;
          border: 1px solid #F7F7F7;
          background-color: transparent;
          border-radius: 14px;
          color: #F7F7F7;
          font-size: 24px;
          text-indent: 24px;
          outline: none;

          ::placeholder {
            color: #F7F7F7;
            font-size: 24px;
            text-indent: 24px;
          }

          :focus {
            border-color: #ccc; // 포커스 시 테두리 색상 변경
          }
        `}
      />
      <br />
    </>
  );
};

export default LoginData;
