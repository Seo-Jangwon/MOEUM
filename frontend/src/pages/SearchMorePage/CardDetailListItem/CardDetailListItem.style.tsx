import { css, Theme } from '@emotion/react';

export const s_container = (theme: Theme) => css`
  display: flex;
  word-break: break-all;
  border: 2px solid ${theme.colors.white};
  cursor: pointer;

  @media (max-width: 768px) {
    width: 90%;
    height: 6vh;
    border-radius: 10px;
  }
  @media (min-width: 768px) {
    width: 60%;
    height: 8vh;
    border-radius: 20px;
  }
`;
export const s_imageContainer = css`
  height: 100%;
  aspect-ratio: 1/1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const s_image = css`
  height: 80%;
  aspect-ratio: 1/1;
  border-radius: 10px;
`;

export const s_textContainer = css`
  display: flex;
  flex-grow: 1;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
`;
