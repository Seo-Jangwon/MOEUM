import { NavLink } from 'react-router-dom';
import { s_container, s_logo } from './Header.style';
import SearchBox from '../SearchBox/SearchBox';
import SideBar from '../SideBar/SideBar';

interface HeaderProps {
  search: boolean;
}

const Header = ({ search }: HeaderProps) => {
  return (
    <header css={s_container}>
      <NavLink css={s_logo} to="/">
        <img src="/logo.svg" alt="logo" />
      </NavLink>
      {search && <SearchBox />}
      {search && <SideBar />}
    </header>
  );
};

export default Header;
