import { s_container, s_label } from './ToggleButton.style';

interface ToggleButtonProps {
  value: boolean;
  onToggle: () => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ value, onToggle }) => {
  return (
    <label css={s_label} htmlFor="toggle">
      <input css={s_container} name="toggle" type="checkbox" checked={value} onChange={onToggle} />
    </label>
  );
};

export default ToggleButton;
