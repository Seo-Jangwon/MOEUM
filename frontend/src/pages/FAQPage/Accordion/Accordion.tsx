import { css } from '@emotion/react';
import React, { ReactNode, useState } from 'react';
import {
  s_accordionChild,
  s_accordionCollapsed,
  s_accordionExpanded,
  s_accordionLeftChild,
  s_accordionTitle,
  s_accordionTitleOpen,
} from './style';

import { MdOutlineKeyboardArrowDown } from 'react-icons/md';

interface accordionProps {
  title: string;
  description: string;
  leftIcon: ReactNode;
}

const Accordion: React.FC<accordionProps> = ({ title, description, leftIcon }) => {
  function openAccordion(): void {
    setIsOpened(!isOpened);
  }
  const [isOpened, setIsOpened] = useState<boolean>(false);
  return (
    <div>
      <div
        css={(theme) => css`
          ${s_accordionTitle(theme)}
          ${isOpened ? s_accordionTitleOpen(theme) : null}
        `}
        onClick={openAccordion}
      >
        <div css={s_accordionLeftChild}>
          {leftIcon}
          <div>{title}</div>
        </div>
        <MdOutlineKeyboardArrowDown />
      </div>
      <div
        css={(theme) => css`
          ${s_accordionChild(theme)}
          ${isOpened ? s_accordionExpanded : s_accordionCollapsed}
        `}
      >
        {description}
      </div>
    </div>
  );
};

export default Accordion;
