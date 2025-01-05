import { css, Theme } from '@emotion/react';

export const s_container = (theme: Theme) => css`
  display: flex;
  text-decoration: none;
  color: ${theme.colors.white};
  gap: 12px;
  flex-direction: column;
  align-items: center;
  font-size: small;
`;

export const s_img_container = (theme: Theme) => css`
  border: 2px solid ${theme.colors.white};
  border-radius: 100%;
  padding: 8px;
  width: 64px;
  height: 64px;
`;

export const s_title = css`
  @media (max-width: 768px) {
    display: none;
  }
`;
