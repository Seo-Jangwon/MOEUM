import { s_input } from './Input.style';

interface InputProps extends React.ComponentPropsWithoutRef<'input'> {
  value: string;
  placeholder: string;
}

const Input = ({ value, placeholder, ...restProps }: InputProps) => {
  return (
    <input
      css={s_input}
      value={value}
      placeholder={placeholder}
      onFocus={(e) => {
        if (value === '') {
          e.target.placeholder = '';
        }
      }}
      onBlur={(e) => {
        if (value === '') {
          e.target.placeholder = placeholder;
        }
      }}
      type="text"
      {...restProps}
    />
  );
};

export default Input;
