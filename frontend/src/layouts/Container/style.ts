import { css, Theme } from '@emotion/react';

export const s_container = (theme: Theme) => css`
  display: flex;
  height: 100vh;
  flex-direction: column;
  background-color: ${theme.colors.background};
`;
