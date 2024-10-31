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
    width: 40vw;
    left: 25vw;
    top: 32.5vh;
    height: 35vh;
  }
  @media (max-width: 768px) {
    height: 35vh;
    width: 70vw;
    top: 32.5vh;
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
  font-size: 16px;
  margin-bottom: 5px;
  text-align: center;
  color: ${theme.colors.white};
`;

export const s_modalTitleContainer = css`
  height: 25%;
  display: flex;
  justify-content: center;
  align-items: center;
  @media (max-width: 768px) {
    font-size: 24px;
  }
`;
export const s_modalBodyContainer = css`
  height: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
export const s_cancelButtonContainer = css`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 25%;
  width: 90%;
`;
export const s_button = (theme: Theme) => css`
  width: 60px;
  height: 30px;
  color: ${theme.colors.dark};
  background-color: ${theme.colors.white};
  border-radius: 10px;
  font-size: 18px;
  text-align: center;
  margin-left: 15px;
`;
