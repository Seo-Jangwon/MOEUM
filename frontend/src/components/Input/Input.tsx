import { ComponentProps } from 'react';
import { s_input } from './Input.style';

interface InputProps extends ComponentProps<'input'> {
  value: string;
  placeholder: string;
}

const Input = ({ ...restProps }: InputProps) => {
  return <input css={s_input} type="text" {...restProps} />;
};

export default Input;
