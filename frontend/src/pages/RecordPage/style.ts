import { Theme, css } from '@emotion/react';

export const s_container = css`
  display: flex;
  width: 75%;
  flex-direction: column;
  margin: 0 auto;

`;

export const s_div_title = (theme: Theme) => css`
  color: ${theme.colors.white};
  font-size: 48px;
  font-weight: 800;
  margin-top: 20px;
`;

export const s_p = (theme: Theme) => css`
  color: ${theme.colors.lightgray};
  font-size: 16px;
  font-weight: 600;
`;
