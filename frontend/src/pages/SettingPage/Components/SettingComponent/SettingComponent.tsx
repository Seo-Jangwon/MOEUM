import { ReactNode } from 'react';
import { s_componentContainer, s_componentLeftChild, s_componentTitleText } from './style';

interface SettingComponentProps {
  iconImage: ReactNode;
  text: string;
  rightButton: ReactNode;
  componentClickListener?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

const SettingComponent: React.FC<SettingComponentProps> = ({
  iconImage,
  text,
  rightButton,
  componentClickListener,
}) => {
  return (
    <div css={s_componentContainer} onClick={componentClickListener}>
      <div css={s_componentLeftChild}>
        {iconImage}
        <div css={s_componentTitleText}>{text}</div>
      </div>
      <div>{rightButton}</div>
    </div>
  );
};

export default SettingComponent;
