import useThemeStore from '@/stores/themeStore';
import { s_container, s_icons, s_label } from './LightModeToggleSwitch.style';
import { BiMoon, BiSun } from 'react-icons/bi';

const LightModeToggleSwitch = () => {
  const { lightMode, toggleLightMode } = useThemeStore();

  return (
    <label css={s_label} htmlFor="toggle">
      <div css={s_icons}>
        <BiMoon size={18} />
        <BiSun size={18} />
      </div>
      <input
        css={s_container}
        name="toggle"
        checked={lightMode}
        onChange={() => toggleLightMode()}
        type="checkbox"
        role="switch"
      />
    </label>
  );
};

export default LightModeToggleSwitch;
