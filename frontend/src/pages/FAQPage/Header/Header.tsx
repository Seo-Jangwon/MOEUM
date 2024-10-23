import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HeaderDiv, HeaderImageButtonStyle } from './style';

const Header: React.FC = () => {
  const navigate = useNavigate();
  // eslint-disable-next-line prefer-const
  let isLoggedIn: boolean = false;
  function toLoginOrSignInPage(): void {
    navigate('/login');
  }
  function toMainPage(): void {
    navigate('/');
  }
  return (
    <div css={HeaderDiv}>
      <div>
        <img src="/logo.svg" alt="햄버거" css={HeaderImageButtonStyle} />
        <img src="/logo.svg" css={HeaderImageButtonStyle} alt="" onClick={toMainPage} />
      </div>
      <input type="text" />
      {isLoggedIn ? (
        <img src="/logo.svg" />
      ) : (
        <button onClick={toLoginOrSignInPage}>로그인/회원가입</button>
      )}
    </div>
  );
};

export default Header;
