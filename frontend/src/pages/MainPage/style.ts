import { css } from '@emotion/react';

export const s_scroll_container = css`
  overflow-y: auto;
  height: 100vh;
  scroll-snap-type: y mandatory;
  margin: auto;

`;
export const s_scroll = css`
  scroll-snap-align: start;
  height: 100vh;
`;
