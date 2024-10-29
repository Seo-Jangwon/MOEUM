import LightModeToggleButton from '@/components/Button/LightModeToggleButton/LightModeToggleButton';
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
        <LightModeToggleButton />
      </S.Header>
    </S.Container>
  );
};

export default SideBarContent;
