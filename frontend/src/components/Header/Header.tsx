import { NavLink, useNavigate } from 'react-router-dom';
import { s_container, s_logo } from './Header.style';
import SearchBox from '../SearchBox/SearchBox';
import SideBar from '../SideBar/SideBar';
import Button from '../Button/Button';

interface HeaderProps {
  search: boolean;
}

const Header = ({ search }: HeaderProps) => {
  const navigate = useNavigate();
  return (
    <nav css={s_container}>
      <NavLink css={s_logo} to="/">
        <img src="/logo.svg" alt="logo" />
      </NavLink>
      <SideBar />
      {search && <SearchBox />}
      {search && (
        <>
          <Button
            variant="inverted"
            style={{ borderRadius: '12px', padding: '10px' }}
            onClick={() => navigate('signin')}
          >
            로그인 / 회원가입
          </Button>
        </>
      )}
    </nav>
  );
};

export default Header;
