import LightModeToggle from '@/components/Toggle/LightModeToggle/LightModeToggle';
import useAuthStore from '@/stores/authStore';
import { FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import * as S from './SideBarContent.style';
interface SideBarContentProps {
  isOpen: boolean;
  closeHandler: () => void;
}

const SideBarContent = ({ isOpen, closeHandler }: SideBarContentProps) => {
  const { isLoggedIn } = useAuthStore();
  const navigate = useNavigate();
  return (
    <S.Container className={isOpen ? 'open' : ''}>
      <S.Header>
        <S.CloseButton onClick={closeHandler}>
          <FiX size={32} />
        </S.CloseButton>
        <div>
          <button onClick={() => navigate('/record')}>내가 본 음악</button>
          <button onClick={() => navigate('/myStorage')}>내 보관함</button>
          <button onClick={() => navigate('/settings')}>설정</button>
          <button onClick={() => navigate('/faq')}>FAQ</button>
          <button onClick={() => navigate('/support')}>1:1 문의</button>
          {isLoggedIn ? <button>로그아웃</button> : <button>로그인</button>}
        </div>
        <LightModeToggle />
      </S.Header>
    </S.Container>
  );
};

export default SideBarContent;
