import { ComponentProps } from 'react';
import { buttonStyle } from './Button.style';
import { ButtonType } from './Button.type';

export interface ButtonProps extends ComponentProps<'button'> {
  variant: ButtonType;
  children: React.ReactNode;
}

const Button = ({ variant, children, ...restProps }: ButtonProps) => {
  return (
    <button css={(theme) => buttonStyle(theme, variant)} {...restProps}>
      {children}
    </button>
  );
};

export default Button;
