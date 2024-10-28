import { css, Theme } from '@emotion/react';

export const s_container = (theme: Theme) => css`
  display: flex;
  height: 100vh;
  flex-direction: column;
  transition: 0.5s ease;
  background-color: ${theme.colors.background};
`;

export const s_content = css`
  flex-grow: 1;
`;
