import { css, Theme } from '@emotion/react';

export const s_label = css`
  height: 32px;
  width: 64px;
  position: relative;
  display: inline-block;
  cursor: pointer;
`;

export const s_container = (theme: Theme) => css`
  &[type='checkbox'] {
    appearance: none;
  }

  display: flex;
  align-items: center;
  gap: 2px;
  cursor: pointer;
  background: ${theme.colors.white};
  border-radius: 64px;
  height: 100%;
  width: 100%;
  padding: 4px;
  margin: 0;
  transition: 0.5s ease;
  position: relative;

  :before {
    content: '';
    display: block;
    height: 24px;
    width: 24px;
    border-radius: 50%;
    background: ${theme.colors.dark};
    position: absolute;
    z-index: 2;
    transform: translate(0);
    transition: transform 0.5s ease;
  }

  &:checked::before {
    transform: translateX(32px);
  }
`;

export const s_icons = (theme: Theme) => css`
  position: absolute;
  inset: 0;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${theme.colors.dark};
  transition: 0.5s ease;
  z-index: 1;
`;
