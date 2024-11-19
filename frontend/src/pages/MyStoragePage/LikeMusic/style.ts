import { css } from '@emotion/react';

export const s_div_img = css`
  margin-left: 5px;
  height: 100px;
  aspect-ratio: 1/1;

  @media(max-width: 768px) {
    height: 50px;
  }
`;

export const s_img = css`
  width: 100%;
  object-fit: cover;
  border-radius: 100%;

`;
