import { css } from '@emotion/react';

export const s_container = css`
  height: 100%;
  position: relative;
`;

export const s_content = css`
  position: absolute;
  display: flex;
  justify-content: center;
  top: 80px;
  left: 0;
  width: 100%;
  height: calc(100vh - 80px);
  min-height: 600px;
  z-index: -1;
`;
