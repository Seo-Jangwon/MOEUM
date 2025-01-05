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
      <SideBarButton
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(true);
        }}
      />
      <SideBarContent isOpen={isOpen} closeSideBar={handleClose} />
    </>
  );
};

SideBar.Button = SideBarButton;
SideBar.Content = SideBarContent;

export default SideBar;
