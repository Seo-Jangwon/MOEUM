import useThemeStore from '@/stores/themeStore';
import { BiMoon, BiSun } from 'react-icons/bi';
import { s_container, s_icons, s_label } from './LightModeToggle.style';

const LightModeToggle = () => {
  const { lightMode, toggleLightMode } = useThemeStore();

  return (
    <label css={s_label} htmlFor="toggle">
      <div css={s_icons}>
        <BiMoon size={18} />
        <BiSun size={18} />
      </div>
      <input
        css={s_container}
        id="toggle"
        checked={lightMode}
        onChange={toggleLightMode}
        type="checkbox"
      />
    </label>
  );
};

export default LightModeToggle;
