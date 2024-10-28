// import sideBarIcon from '@/assets/icon/sidebar-icon.svg';
import SideBarIcon from '../SideBarIcon';
import { s_button } from './SideBarButton.style';

const SideBarButton = () => {
  return (
    <button type="button" css={s_button}>
      <SideBarIcon />
    </button>
  );
};

export default SideBarButton;
