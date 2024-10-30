import useAuthStore from '@/stores/authStore';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Button from '../Button/Button';
import SearchBox from '../SearchBox/SearchBox';
import SideBar from '../SideBar/SideBar';
import { s_container, s_logo } from './Header.style';
import ProfileModal from './ProfileModal/ProfileModal';

interface HeaderProps {
  search: boolean;
}

const Header = ({ search }: HeaderProps) => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();

  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  return (
    <nav css={s_container}>
      <div css={{ display: 'flex', gap: '8px', alignItems: 'center', zIndex: 1 }}>
        <SideBar />
        <NavLink css={s_logo} to="/">
          <img src="/logo.svg" alt="logo" />
        </NavLink>
      </div>
      {search && <SearchBox />}
      {search && (
        <div style={{ zIndex: 1 }}>
          {isLoggedIn ? (
            <img src="/logo.svg" onClick={() => setIsProfileModalOpen(true)} />
          ) : (
            <Button
              variant="inverted"
              style={{ borderRadius: '12px', padding: '8px' }}
              onClick={() => navigate('signin')}
            >
              로그인 / 회원가입
            </Button>
          )}
        </div>
      )}
      {isProfileModalOpen ? (
        <ProfileModal changeModalStatus={() => setIsProfileModalOpen(false)} />
      ) : null}
    </nav>
  );
};

export default Header;
