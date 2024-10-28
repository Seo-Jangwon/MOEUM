import { css, Theme } from '@emotion/react';

export const s_cardContainer = css`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
  border-radius: 20px;
  @media (min-width: 768px) {
    height: 10vw;
    width: 10vw;
  }
  @media (max-width: 767px) {
    height: 5vw;
    width: 20vw;
    font-size: 14px;
    font-weight: 500;
    border-radius: 5px;
    margin: 0 3px;
  }
`;

export const s_ClickedCard = (theme: Theme) => css`
  background-color: ${theme.colors.primary};
`;

export const s_UnClickedCard = (theme: Theme) => css`
  background-color: ${theme.colors.lightgray};
  :hover {
    background-color: ${theme.colors.secondary};
    cursor: pointer;
  }
`;

export const s_CardImg = css`
  @media (max-width: 767px) {
    display: none;
    width: 50px;
    height: 50px;
  }
`;
