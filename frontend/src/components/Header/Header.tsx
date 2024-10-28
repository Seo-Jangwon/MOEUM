import { NavLink, useNavigate } from 'react-router-dom';
import { s_container, s_logo } from './Header.style';
import SearchBox from '../SearchBox/SearchBox';
import SideBar from '../SideBar/SideBar';
import Button from '../Button/Button';
import { useState } from 'react';
import useAuthStore from '@/stores/authStore';
import ProfileModal from './ProfileModal/ProfileModal';

interface HeaderProps {
  search: boolean;
}

const Header = ({ search }: HeaderProps) => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();

  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  function changeProfileModalState() {
    setIsProfileModalOpen(!isProfileModalOpen);
  }
  return (
    <nav css={s_container}>
      <NavLink css={s_logo} to="/">
        <img src="/logo.svg" alt="logo" />
      </NavLink>
      <SideBar />
      {search && <SearchBox />}
      {search && (
        <>
          {isLoggedIn === true ? (
            <img src="/logo.svg" onClick={changeProfileModalState} />
          ) : (
            <Button
              variant="inverted"
              style={{ borderRadius: '12px', padding: '10px' }}
              onClick={() => navigate('signin')}
            >
              로그인 / 회원가입
            </Button>
          )}
        </>
      )}
      {isProfileModalOpen === true ? (
        <ProfileModal changeModalStatus={changeProfileModalState} />
      ) : null}
    </nav>
  );
};

export default Header;
