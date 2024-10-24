import { NavLink } from 'react-router-dom';
import { s_container, s_logo } from './Header.style';
import SearchBox from '../SearchBox/SearchBox';

interface HeaderProps {
  search: boolean;
}

const Header = ({ search = true }: HeaderProps) => {
  return (
    <header css={s_container}>
      <NavLink css={s_logo} to="/">
        <img src="/logo.svg" alt="logo" />
        모음
      </NavLink>
      {search && <SearchBox />}
      {}
    </header>
  );
};

export default Header;
