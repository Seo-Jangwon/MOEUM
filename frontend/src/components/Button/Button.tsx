import { buttonStyle } from './Button.style';
import { ButtonType } from './Button.type';

interface ButtonProps {
  type: ButtonType;
  children: React.ReactNode;
}

const Button = ({ type, children, ...restProps }: ButtonProps) => {
  return (
    <button css={buttonStyle(type)} {...restProps}>
      {children}
    </button>
  );
};

export default Button;
