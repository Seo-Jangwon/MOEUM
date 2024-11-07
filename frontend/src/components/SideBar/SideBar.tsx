import { useState } from 'react';
import SideBarButton from './SideBarButton/SideBarButton';
import SideBarContent from './SideBarContent/SideBarContent';

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => {
    setIsOpen(false);
  };
  return (
    <>
      <SideBarButton onClick={() => setIsOpen(true)} />
      <SideBarContent isOpen={isOpen} closeHandler={handleClose} />
    </>
  );
};

SideBar.Button = SideBarButton;
SideBar.Content = SideBarContent;

export default SideBar;
