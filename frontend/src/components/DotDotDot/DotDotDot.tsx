import { css } from '@emotion/react';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { AiOutlineMore } from 'react-icons/ai';
import DropDown from '../DropDown/DropDown';
import { s_icon } from './style';

interface DropDownItems {
  iconImage: ReactNode;
  text: string;
  clickHandler: (e: React.MouseEvent<HTMLButtonElement>) => void;
  size: number;
}

interface DotDotDotProps {
  data: DropDownItems[];
}

const DotDotDot: React.FC<DotDotDotProps> = ({ data }) => {
  const [isDropDown, setIsDropDown] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleDropDown = () => {
    setIsDropDown(!isDropDown);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropDown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef}>
      <AiOutlineMore css={s_icon} onClick={handleDropDown} size={data[0].size} />
      {isDropDown && (
        <ul
          css={css`
            position: absolute;
            background-color: #444;
            white-space: nowrap;
            padding: 10px;
            border-radius: 8px;
            margin: 0;
            list-style: none;
            z-index: 1;
          `}
        >
          <DropDown data={data} closeDropdown={() => setIsDropDown(false)} />
        </ul>
      )}
    </div>
  );
};

export default DotDotDot;
