import { css, Theme } from '@emotion/react';

export const s_accordionTitle = (theme: Theme) => css`
  display: flex;
  justify-content: space-between;
  border: 1px solid ${theme.colors.white};
  text-align: center;
  border-radius: 10px;
  color: ${theme.colors.white};
  word-break: normal;
  padding: 10px 20px;
  transition: background-color 0.3s ease-in-out;
  cursor: pointer;
  @media (max-width: 768px) {
    margin: 0px 5vw 5px;
    font-size: 16px;
  }
  @media (min-width: 768px) {
    margin: 0px 20vw 5px;
    font-size: 24px;
  }
`;

export const s_accordionTitleOpen = (theme: Theme) => css`
  background-color: ${theme.colors.primary};
`;

export const s_accordionLeftChild = css`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

export const s_accordionTitleText = css`
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
  @media (max-width: 768px) {
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
  border-radius: 10px;
`;

export const s_accordionCollapsed = css`
  height: 0;
  opacity: 0;
  overflow: hidden;
`;
