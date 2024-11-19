import { css, Theme } from '@emotion/react';

export const s_link_color = (theme: Theme) => css`
  color: ${theme.colors.white};
  :hover {
    color: ${theme.colors.gray};
    transition: 0.3s;
  }
`;
