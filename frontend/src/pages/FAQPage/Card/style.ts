import { css } from '@emotion/react';

export const CardDiv = css`
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
    width: 70px;
    font-size: 16px;
    border-radius: 5px;
    margin: 0 3px;
  }
`;

export const CardClicked = css`
  background-color: #f7309d;
`;

export const CardUnClicked = css`
  background-color: #444444;
  :hover {
    background-color: #30ddf7;
  }
`;

export const CardImg = css`
  @media (max-width: 767px) {
    display: none;
    width: 50px;
    height: 50px;
  }
`;
