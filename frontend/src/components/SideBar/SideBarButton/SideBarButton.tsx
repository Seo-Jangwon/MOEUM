// import SideBarButtonIcon from '@/assets/icon/sidebar-icon.svg';
import { ComponentPropsWithoutRef } from 'react';
import { s_button } from './SideBarButton.style';
import SideBarButtonIcon from './SideBarButtonIcon';

const SideBarButton = ({ ...restProps }: ComponentPropsWithoutRef<'button'>) => {
  return (
    <button type="button" css={s_button} {...restProps}>
      <SideBarButtonIcon />
    </button>
  );
};

export default SideBarButton;
