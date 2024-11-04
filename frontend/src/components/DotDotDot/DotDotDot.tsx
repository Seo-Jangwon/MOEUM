import { css } from '@emotion/react';
import { ReactNode, useState } from 'react';
import { AiOutlineMore } from 'react-icons/ai';
import DropDown from '../DropDown/DropDown';
import { s_icon } from './style';


interface DropDownItems {
  iconImage: ReactNode;
  text: string;
  clickHandler: () => void;
}

interface DotDotDotProps {
  data: DropDownItems[]
}

const DotDotDot: React.FC<DotDotDotProps>= ({ data }) => {
  const [isDropDown, setIsDropDown] = useState<boolean>(false);

  const handleDropDown = () => {
    setIsDropDown(!isDropDown);
  };

  return (
    <div >
      <AiOutlineMore css={s_icon} onClick={handleDropDown} />
      {isDropDown && (
        <ul
          css={css`
            position: absolute;
            background-color: #444;
            white-space: nowrap;
            padding: 10px;
            border-radius: 8px;
          `}
        >
          <DropDown data={data} />
        </ul>
      )}
    </div>
  );
};

export default DotDotDot;
