import { css, Theme } from '@emotion/react';

export const s_componentContainer = (theme: Theme) => css`
  display: flex;
  justify-content: space-between;
  border: 1px solid ${theme.colors.white};
  text-align: center;
  border-radius: 10px;
  color: ${theme.colors.white};
  padding: 10px 20px;
  @media (max-width: 767px) {
    margin: 0px 5vw 15px;
    width: 90vw;
    font-size: 20px;
  }
  @media (min-width: 768px) {
    margin: 0px 20vw 20px;
    width: 60vw;
    font-size: 24px;
  }
`;

export const s_componentLeftChild = css`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

export const s_componentTitleText = css`
  padding-left: 10px;
`;

export const s_accordionChild = (theme: Theme) => css`
  display: flex;
  align-items: center;
  text-align: left;
  color: ${theme.colors.white};
  word-break: normal;
  transition: height 0.3s ease-in-out;
  transition: opacity 0.3s ease-in-out;
  @media (max-width: 767px) {
    margin: 0px 5vw 5px 5vw;
  }
  @media (min-width: 768px) {
    margin: 0px 20vw 5px 20vw;
  }
`;
