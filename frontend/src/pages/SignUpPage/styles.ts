import { Theme, css } from '@emotion/react';

export const s_from = css`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const s_button = css`
  width: 122px;
  height: 45px;
`;

export const s_p = (theme: Theme) => css`
  text-align: center;
  ${theme.typography.heading};
  ${theme.colors.white};
  margin: 20px;
`;
