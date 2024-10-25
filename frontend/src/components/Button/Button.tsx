import { ComponentProps } from 'react';
import { buttonStyle } from './Button.style';
import { ButtonVariants } from './Button.type';

export interface ButtonProps extends ComponentProps<'button'> {
  variant: ButtonVariants;
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
