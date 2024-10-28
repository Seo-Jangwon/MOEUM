import { css, Theme } from '@emotion/react';

export const s_div_bgc = (theme: Theme) => css`
  width: 100%;
  background-color: ${theme.colors.lightgray};
  border-radius: 5px;
  overflow: hidden;
`;

export const s_div = (theme: Theme) => css`
  height: 10px;
  background: linear-gradient(90deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%);
  ;
  transition: width 0.3s ease-in-out;
`;
