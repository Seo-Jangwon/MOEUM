import { css } from '@emotion/react';

export const s_container = css`
  /* margin-top: 100000px; */
  display: flex;
  width: 75%;
  flex-direction: column;
  margin: 0 auto;
  gap: 120px;
  @media(max-width: 768px) {
    gap: 60px;
  }
`;

export const s_box = css`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;
