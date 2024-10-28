import { css, Theme } from '@emotion/react';

export const s_button = (theme: Theme) => css`
  border: none;
  color: ${theme.colors.white};
  width: 36px;
  height: 36px;
  background: none;
  cursor: pointer;
`;
