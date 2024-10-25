import { css, Theme } from '@emotion/react';

export const s_container = (theme: Theme) => css`
  display: flex;
  text-decoration: none;
  color: ${theme.colors.white};
  gap: 16px;
  flex-direction: column;
  align-items: center;
`;

export const s_img_container = (theme: Theme) => css`
  border: 2px solid ${theme.colors.white};
  border-radius: 100%;
  padding: 12px;
  width: 64px;
  height: 64px;
`;
