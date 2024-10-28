import LightModeToggleSwitch from '@/components/LightModeToggleSwitch/LightModeToggleSwitch';
import { s_container } from './SideBarContent.style';

const SideBarContent = () => {
  return (
    <aside css={s_container}>
      <LightModeToggleSwitch />
    </aside>
  );
};

export default SideBarContent;
