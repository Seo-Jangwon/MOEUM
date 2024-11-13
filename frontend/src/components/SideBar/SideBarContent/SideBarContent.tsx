import ContactModal from '@/components/Modal/ConatactModal/ContactModal';
import LightModeToggle from '@/components/Toggle/LightModeToggle/LightModeToggle';
import useClickOutside from '@/hooks/useClickOutside';
import useAuthStore from '@/stores/authStore';
import { useState } from 'react';
import { FiEye, FiX } from 'react-icons/fi';
import { IoMdSettings } from 'react-icons/io';
import { IoFileTrayStackedOutline } from 'react-icons/io5';
import SideBarContentItem from '../SideBarContentItem/SideBarContentItem';
import * as S from './SideBarContent.style';

interface SideBarContentProps {
  isOpen: boolean;
  closeSideBar: () => void;
}

const SideBarContent = ({ isOpen, closeSideBar }: SideBarContentProps) => {
  const { isLoggedIn, signOut } = useAuthStore();
  const [isContactModalOpen, setIsConatctModalOpen] = useState(false);
  const containerRef = useClickOutside(closeSideBar);

  const openContactModal = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation();
    setIsConatctModalOpen(true);
  };
  const closeContactModal = () => {
    // e.stopPropagation();
    setIsConatctModalOpen(false);
  };

  const handleBubbleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if ((e.target as HTMLElement).closest('a')) closeSideBar();
  };

  return (
    <S.Container className={isOpen ? 'open' : ''} onClick={handleBubbleClick} ref={containerRef}>
      <S.Header>
        <S.CloseButton onClick={closeSideBar}>
          <FiX size={32} />
        </S.CloseButton>
        <LightModeToggle />
      </S.Header>
      <S.Content>
        <S.Section>
          <SideBarContentItem title="내가 본 음악" to="/record" Icon={FiEye} color="F7309D" />
          <SideBarContentItem title="내 보관함" to="/myStorage" Icon={IoFileTrayStackedOutline} color="30DDF7" />
          <SideBarContentItem
            title="설정"
            to="/settings"
            Icon={IoMdSettings}
            color="30F751"
            style={{ marginTop: '100px' }}
          />
        </S.Section>
      </S.Content>
      <S.Footer>
        <S.RouterLink to="/faq">FAQ</S.RouterLink>
        <S.RouterLink to="#" onClick={openContactModal}>
          1:1 문의
        </S.RouterLink>
        {isLoggedIn ? <a onClick={signOut}>로그아웃</a> : <S.RouterLink to="/signin">로그인</S.RouterLink>}
      </S.Footer>
      {isContactModalOpen && <ContactModal handleClose={closeContactModal} />}
    </S.Container>
  );
};

export default SideBarContent;
