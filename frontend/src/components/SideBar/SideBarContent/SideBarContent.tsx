import LightModeToggle from '@/components/Toggle/LightModeToggle/LightModeToggle';
import * as S from './SideBarContent.style';
import { FiX } from 'react-icons/fi';
interface SideBarContentProps {
  isOpen: boolean;
  closeHandler: () => void;
}

const SideBarContent = ({ isOpen, closeHandler }: SideBarContentProps) => {
  return (
    <S.Container className={isOpen ? 'open' : ''}>
      <S.Header>
        <S.CloseButton onClick={closeHandler}>
          <FiX size={32} />
        </S.CloseButton>
        <LightModeToggle />
      </S.Header>
    </S.Container>
  );
};

export default SideBarContent;
