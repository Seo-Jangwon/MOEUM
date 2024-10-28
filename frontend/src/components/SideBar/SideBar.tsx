import LightModeToggleButton from '@/components/LightModeToggleSwitch/LightModeToggleSwitch';
import SideBarButton from './SideBarButton/SideBarButton';
import SideBarContent from './SideBarContent/SideBarContent';

const SideBar = () => {
  return (
    <div>
      <LightModeToggleButton />
    </div>
  );
};

SideBar.Button = SideBarButton;
SideBar.Content = SideBarContent;

export default SideBar;
