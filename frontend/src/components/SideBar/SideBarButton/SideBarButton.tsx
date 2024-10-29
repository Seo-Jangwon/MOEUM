// import sideBarIcon from '@/assets/icon/sidebar-icon.svg';
import { ComponentPropsWithoutRef } from 'react';
import SideBarIcon from '../SideBarIcon';
import { s_button } from './SideBarButton.style';

const SideBarButton = ({ ...restProps }: ComponentPropsWithoutRef<'button'>) => {
  return (
    <button type="button" css={s_button} {...restProps}>
      <SideBarIcon />
    </button>
  );
};

export default SideBarButton;
