import lala from '@/assets/lalaticon/lala.jpg';
import { css, Theme } from '@emotion/react';

export const s_container = css``;

export const s_titleContainer = (theme: Theme) => css`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 10vh;
  color: ${theme.colors.white};
  font-weight: 600;
  @media (max-width: 768px) {
    font-size: 32px;
    margin-bottom: 3vh;
  }
  @media (min-width: 768px) {
    font-size: 40px;
    margin-bottom: 10vh;
  }
`;

export const s_componentsContainer = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const s_inputsContainer = css`
  flex-direction: column;
  transform: rotate(-90deg);
  height: 125px;
  row-gap: 20px;
  span {
    transform: rotate(90deg);
  }
`;

export const s_inputContainer = css`
  display: flex;
  div {
    width: 30px;
    transform: rotate(90deg);
  }
`;

export const s_inputBar = css`
  -webkit-appearance: none;
  appearance: none;
  width: 100px;
  height: 8px;
  background: #ddd;
  border-radius: 5px;
  outline: none;
  ::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 30px;
    height: 30px;
    background-image: url(${lala});
    border-radius: 20px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    transform: rotate(90deg);
    cursor: pointer;
    border: none;
  }
  ::-moz-range-thumb {
    width: 30px;
    transform: rotate(90deg);
    height: 30px;
    background-image: url(${lala});
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    cursor: pointer;
    border: none;
  }
`;
