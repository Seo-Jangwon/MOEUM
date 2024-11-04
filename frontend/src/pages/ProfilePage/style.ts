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

export const s_textContainer = (theme: Theme) => css`
  width: 100%;
  color: ${theme.colors.white};
  @media (max-width: 768px) {
    padding-bottom: 10px;
    font-size: 24px;
    padding-left: 20vw;
  }
  @media (min-width: 768px) {
    padding-left: 30vw;
    padding-bottom: 20px;
    font-size: 32px;
  }
`;

export const s_componentsContainer = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const s_modalText = css`
  margin-bottom: 15px;
  line-height: 1.6;
  @media (min-width: 768px) {
    font-size: 20px;
  }
  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

export const s_modalInputStyle = css`
  height: 3.5vh;
  @media (min-width: 768px) {
    font-size: 20px;
    width: 30vw;
  }
  @media (max-width: 768px) {
    font-size: 16px;
    width: 60vw;
    &[type='file'] {
      width: 68vw;
    }
  }
`;
