import { Theme, css } from '@emotion/react';

export const s_icon = (theme: Theme) => css`
  color: ${theme.colors.white};
  font-size: 30px;
  :hover {
    transform: scale(1.2);
    transition: 0.3s;
    cursor: pointer;
  }
`;
