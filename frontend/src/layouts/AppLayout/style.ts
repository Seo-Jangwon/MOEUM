import { css, Theme } from '@emotion/react';

export const s_container = (theme: Theme) => css`
  display: flex;
  height: 100vh;
  flex-direction: column;
  background-color: ${theme.colors.background};
  transition: background-color 0.5s ease  ;
`;

export const s_content = css`
  flex-grow: 1;
`;
