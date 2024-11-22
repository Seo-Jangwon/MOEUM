import { css, Theme } from '@emotion/react';

export const s_container = css`
  display: flex;
  position: sticky;
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

export const s_searchButton = (theme: Theme) => css`
  @media (max-width: 768px) {
    display: block;
  }
  background: none;
  border: none;
  display: none;
  color: ${theme.colors.white};
  padding: 8px;
  border-radius: 16px;
  transition: 200ms ease-in-out 0s;
  :active {
    color: ${theme.colors.dark};
  }
`;

export const s_headerItem = css`
  z-index: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const s_logo = (theme: Theme) => css`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${theme.colors.white};
  font-size: large;
  font-weight: bold;
`;

export const s_profileButton = (theme: Theme) => css`
  color: ${theme.colors.white};
  border-radius: 100%;
  padding: 8px;
  overflow: hidden;
`;
