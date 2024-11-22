import { css, Theme } from '@emotion/react';

export const s_container = (theme: Theme) => css`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${theme.colors.background};
`;

export const s_content = css`
  display: flex;
  justify-content: center;
  width: 100%;
  /* min-height: 600px; */
`;
