import { css } from '@emotion/react';

export const accordionItemStyle = css`
  display: flex;
  align-items: center;
  text-align: left;
  border: 1px solid white;
  border-radius: 10px;
  color: white;
  margin: 10px 20vw;
  word-break: normal;
  padding: 5px 20px;
  @media (max-width: 767px) {
    margin: 10px 5vw;
  }
  @media (min-width: 768px) {
    margin: 10px 20vw;
  }
`;

export const hiddenAccordion = css`
  display: none;
`;
