import { buttonStyle } from './Button.style';
import { ButtonVariants } from './Button.type';

export interface ButtonProps extends React.ComponentProps<'button'> {
  variant: ButtonVariants;
  children: React.ReactNode;
}

const Button = ({ variant, children, ...restProps }: ButtonProps) => {
  return (
    <button type="button" css={(theme) => buttonStyle(theme, variant)} {...restProps}>
      {children}
    </button>
  );
};

export default Button;
