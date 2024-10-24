import { css, Theme } from '@emotion/react';

export const s_accordionTitle = (theme: Theme) => css`
  display: flex;
  align-items: center;
  text-align: left;
  border: 1px solid white;
  color: ${theme.colors.white};
  word-break: normal;
  padding: 0px 20px;
  transition: all 0.3s ease-in-out;
  @media (max-width: 767px) {
    margin: 0px 5vw;
  }
  @media (min-width: 768px) {
    margin: 0px 20vw;
  }
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

export const s_accordionExpanded = css`
  border: 1px solid white;
  opacity: 1;
  height: 100%;
  padding: 5px 20px;
  margin: 0px 20vw 20px 20vw;
  border-radius: 0 0 10px 10px;
`;

export const s_accordionCollapsed = css`
  height: 0;
  opacity: 0;
  overflow: hidden;
`;
