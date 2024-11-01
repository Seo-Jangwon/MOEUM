import { css, Theme } from "@emotion/react";

export const s_h1 = (theme: Theme) => css`
  font-size: 2.3rem;
  font-weight: 700;
  color: ${theme.colors.white};
  text-align: center;
`