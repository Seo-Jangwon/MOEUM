import { css } from '@emotion/react';
import { ReactNode } from 'react';
import { s_li } from './style';

interface DropDownItems {
  iconImage: ReactNode;
  text: string;
  clickHandler: () => void;
  size: number
}

interface DropDownProps {
  data: DropDownItems[];
  closeDropdown: () => void;
}

const DropDown: React.FC<DropDownProps> = ({ data, closeDropdown }) => {
  return (
    <>
      {data.map((item, index) => (
        <li
          key={index}
          onClick={() => {
            item.clickHandler();
            closeDropdown();
          }}
          css={s_li}
        >
          <div>{item.iconImage}</div>
          <span
            css={css`
              margin-left: 8px;
            `}
          >
            {item.text}
          </span>
        </li>
      ))}
    </>
  );
};

export default DropDown;
