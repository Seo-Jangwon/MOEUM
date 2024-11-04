import { css } from '@emotion/react';
import { ReactNode } from 'react';
import { s_li } from './style';

interface DropDownItems {
  iconImage: ReactNode;
  text: string;
  clickHandler: () => void;
}

interface DotDotDotProps {
  data: DropDownItems[];
}

const DropDown: React.FC<DotDotDotProps> = ({ data }) => {
  console.log(data[0].iconImage);
  return (
    <>
      {data.map((item, index) => (
        <li key={index} onClick={item.clickHandler} css={s_li}>
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
