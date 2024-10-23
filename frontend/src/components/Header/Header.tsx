import { NavLink } from 'react-router-dom';
import { headerStyle } from './Header.style';

const Header = () => {
  return (
    <header css={headerStyle}>
      <NavLink to="/">
        <img src="/logo.svg" alt="logo" />
      </NavLink>
    </header>
  );
};

export default Header;
