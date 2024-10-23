import React, { useState } from 'react';
import { accordionItemStyle, hiddenAccordion } from './style';
import { css } from '@emotion/react';

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
      <div css={accordionItemStyle}>
        <img src={imgUrl} alt="" />
        <div>{title}</div>
        <button onClick={openAccordion}>▼</button>
      </div>
      <div
        css={css`
          ${isOpened ? accordionItemStyle : hiddenAccordion}
        `}
      >
        {description}
      </div>
    </div>
  );
};

export default Accordion;
