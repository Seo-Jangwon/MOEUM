import { css, Theme } from '@emotion/react';

export const s_container = css`
  display: flex;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  height: 80px;
  z-index: 90;
  ::before {
    content: '';
    position: absolute;
    inset: 0;
    backdrop-filter: blur(50px);
  }
`;

export const s_logo = (theme: Theme) => css`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${theme.colors.white};
  font-size: large;
  font-weight: bold;
`;
