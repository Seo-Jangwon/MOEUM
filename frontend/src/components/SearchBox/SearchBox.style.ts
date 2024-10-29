import { css, Theme } from '@emotion/react';

export const s_wrapper = css`
  display: flex;
  position: absolute;
  left: 0;
  width: 100%;
  justify-content: center;
`;

export const s_container = (theme: Theme, lightMode: boolean) => css`
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 16px;
  width: 400px;
  height: 36px;
  border: none;
  border-radius: 12px;
  background: ${lightMode ? '#AAA' : '#444'};
  color: ${lightMode ? '#d2d2d2' : '#aaa'};
  padding: 0 10px;
  transition: 0.2s ease;
  :focus-within {
    color: #fff;
    outline: 2px solid ${theme.colors.white};
  }
  @media (max-width: 767px) {
    display: none;
  }
`;

export const s_input = css`
  color: inherit;
  width: 100%;
  font-size: large;
  background: none;
  border: none;
  outline: none;
  ::placeholder {
    color: inherit;
  }
`;

export const s_button = css`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  padding: 0;
  color: inherit;
`;
