import useAuthStore from '@/stores/authStore';
import useUserInfoStore from '@/stores/userInfoStore';
import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { PiUserCircle } from 'react-icons/pi';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Button from '../Button/Button';
import SearchBox from '../SearchBox/SearchBox';
import SideBar from '../SideBar/SideBar';
import { s_container, s_headerItem, s_logo, s_profileButton, s_searchButton } from './Header.style';

interface HeaderProps {
  search: boolean;
}

const Header = ({ search }: HeaderProps) => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const userInfo = useUserInfoStore((state) => state.userInfo);

  return (
    <nav css={s_container}>
      {!isSearchOpen && (
        <div css={{ display: 'flex', gap: '8px', alignItems: 'center', zIndex: 1 }}>
          <SideBar />
          <NavLink css={s_logo} to="/">
            <img src="/logo.svg" alt="logo" />
          </NavLink>
        </div>
      )}
      {search && <SearchBox isOpen={isSearchOpen} handleClose={() => setIsSearchOpen(false)} />}
      {search && !isSearchOpen && (
        <div css={s_headerItem}>
          <button
            css={s_searchButton}
            onClick={(e) => {
              e.stopPropagation();
              setIsSearchOpen(true);
            }}
          >
            <FiSearch size={28} />
          </button>
          {isLoggedIn ? (
            <Link to="/profile" css={s_profileButton}>
              {userInfo.profileImage ? (
                <img src={userInfo.profileImage} alt="profile" style={{ width: '100%', height: '100%' }} />
              ) : (
                <PiUserCircle size={32} />
              )}
            </Link>
          ) : (
            <Button
              variant="inverted"
              style={{ borderRadius: '12px', padding: '8px 20px' }}
              onClick={() => navigate('signin')}
            >
              로그인
            </Button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Header;
