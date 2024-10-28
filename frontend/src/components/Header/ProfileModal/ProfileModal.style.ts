import { css, Theme } from '@emotion/react';

export const s_fullScreenWithModal = (theme: Theme) => css`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${theme.colors.lightgray};
  opacity: 0.5;
  z-index: 5;
`;

export const s_modalContainer = (theme: Theme) => css`
  @media (min-width: 768px) {
    height: 50vh;
    width: 50vw;
    top: 25vh;
    left: 25vw;
  }
  @media (max-width: 767px) {
    height: 70vh;
    width: 70vw;
    top: 15vh;
    left: 15vw;
  }
  background-color: ${theme.colors.dark};
  border: 3px solid ${theme.colors.dark};
  border-radius: 10px;
  height: 400px;
  width: 200px;
  display: flex;
  position: absolute;
  left: 0;
  top: 0;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  z-index: 10;
`;

export const s_exitButton = css`
  position: absolute;
  top: 5px;
  right: 5px;
`;

export const s_img = css`
  height: 75px;
  width: 75px;
  border-radius: 100%;
  margin-bottom: 20px;
`;

export const s_text = (theme: Theme) => css`
  font-size: 20px;
  margin-bottom: 5px;
  text-align: center;
  color: ${theme.colors.white};
`;
