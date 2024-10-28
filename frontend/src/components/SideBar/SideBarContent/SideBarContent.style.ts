import { css, Theme } from '@emotion/react';

export const s_container = (theme: Theme) => css`
  display: none;
  width: 600px;
  height: 100%;
  flex-direction: column;
  position: fixed;
  left: 0;
  bottom: 0;
  background-color: ${theme.colors.dark};
`;
