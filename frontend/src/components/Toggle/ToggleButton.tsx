import React from 'react';
import { s_container, s_label } from './ToggleButton.style';

interface toggleButtonProps {
  value: boolean;
  onToggle: () => void;
}

const ToggleButton: React.FC<toggleButtonProps> = ({ value, onToggle }) => {
  return (
    <label css={s_label} htmlFor="toggle">
      <input css={s_container} name="toggle" type="checkbox" checked={value} onChange={onToggle} />
    </label>
  );
};

export default ToggleButton;
