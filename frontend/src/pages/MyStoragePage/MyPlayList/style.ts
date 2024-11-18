import { css } from "@emotion/react";

export const s_div_item_box = css`
  position: relative;
  border: 0;
  overflow: hidden;
  width: 100%; 
  background: transparent;
  :hover {
    transition: 0.3s;
    filter: brightness(50%);
  }
  :hover > h5 {
    opacity: 1;
  }
`;

export const s_div_item_container = css`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); /* 최소 너비를 250px로 지정 */
  gap: 20px;
  @media (max-width: 768px) {
    gap: 10px;
  }
`;