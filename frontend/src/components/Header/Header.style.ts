import { css, Theme } from '@emotion/react';

export const s_container = css`
  display: flex;
  width: 100%;
  top: 0;
  align-items: center;
  padding: 0 80px;
  height: 80px;
`;

export const s_logo = (theme: Theme) => css`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${theme.colors.white};
  font-size: large;
  font-weight: bold;
`;
