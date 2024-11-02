import { css } from '@emotion/react';

export const s_img = css`
  @keyframes fadeInBackground {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  animation: fadeInBackground 3s ease forwards;
  width: 100vw;
`;

export const s_container = css`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  display: flex;
  align-items: center;
`;
