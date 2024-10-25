import React, { useState } from 'react';
import {
  s_accordionTitle,
  s_accordionExpanded,
  s_accordionCollapsed,
  s_accordionChild,
} from './style';
import { css, Theme } from '@emotion/react';

interface accordionProps {
  imgUrl: string;
  title: string;
  description: string;
}

const Accordion: React.FC<accordionProps> = ({ imgUrl, title, description }) => {
  function openAccordion(): void {
    setIsOpened(!isOpened);
  }
  const [isOpened, setIsOpened] = useState<boolean>(false);
  return (
    <div>
      <div css={s_accordionTitle}>
        <img src={imgUrl} alt="" />
        <div>{title}</div>
        <button onClick={openAccordion}>▼</button>
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
