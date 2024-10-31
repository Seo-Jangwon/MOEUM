import { css, Theme } from '@emotion/react';

export const s_wrapper = css`
  display: flex;
  width: 100%;
  justify-content: center;
`;

export const s_container = (theme: Theme, lightMode: boolean, recentKeywordScreen: boolean) => css`
  display: flex;
  position: relative;
  justify-content: space-around;
  align-items: center;
  gap: 16px;
  width: 400px;
  height: 36px;
  border: none;
  border-radius: ${recentKeywordScreen ? '5px 5px 0 0' : '10px'};
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

export const s_searchKeywordContainer = (theme: Theme) => css`
  position: absolute;
  z-index: 100;
  background-color: inherit;
  display: flex;
  border-radius: 0 0 15px 15px;
  padding: 10px 5px;
  flex-direction: column-reverse;
  width: 100%;
  top: 38px;
  outline: 2px solid ${theme.colors.white};
  color: inherit;
`;

export const s_searchKeywordButtonContainer = css`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

export const s_searchKeywordDiv = css`
  display: flex;
  padding: 0 5px;
  justify-content: space-between;
  align-items: center;
  margin: 2px 0;
  text-align: center;
`;
