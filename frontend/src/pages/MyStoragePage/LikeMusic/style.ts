import { css } from '@emotion/react';

export const s_div_img = css`
  border-radius: 100%;
  overflow: hidden;
  margin: 5%;
  width: 50%;
  :hover {
    filter: brightness(0.5);
  }
`;

export const s_img = css`
  width: 100%;
  object-fit: cover;
`;
