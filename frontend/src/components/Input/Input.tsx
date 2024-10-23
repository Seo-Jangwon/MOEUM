import { s_input } from './Input.style';

interface InputProps {}

const Input = ({ value, placeholder, ...restProps }: InputProps) => {
  return <input css={s_input} type="text" {...restProps} />;
};

export default Input;
