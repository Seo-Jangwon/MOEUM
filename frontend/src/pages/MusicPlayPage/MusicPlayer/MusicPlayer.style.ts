import { css, Theme } from '@emotion/react';

export const s_container = css`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
`;

export const s_videoContainer = css`
  align-items: center;
  justify-content: center;
  display: flex;
  @media (max-width: 768px) {
    width: 90%;
    flex-direction: column;
  }
  @media (min-width: 768px) {
    width: 100%;
  }
  aspect-ratio: 16/9;
  position: relative;
`;

export const s_infoContainer = css`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: flex-start;
  justify-content: center;
  margin-top: 10px;
  @media (max-width: 768px) {
    padding-left: 5%;
  }
`;

export const s_canvas = css`
  width: 100%;
  aspect-ratio: 16/9;
`;

export const s_playerBarContainer = (theme: Theme) => css`
  display: flex;
  position: absolute;
  flex-direction: column;
  justify-content: center;
  bottom: 0;
  left: 0;
  align-items: center;
  width: 100%;
  margin: 3px 0;
  color: ${theme.colors.dark};
`;

export const s_palyerBar = css`
  flex-direction: column;
  width: 100%;
  > div {
    width: 95%;
    margin: 0 2.5%;
  }
`;

export const s_lyrics = css`
  @media (max-width: 768px) {
    font-size: 1rem;
  }
  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
  margin-bottom: 10px;
`;

export const s_playerBarRange = (progress: number) => css`
  flex-grow: 1;
  height: 6px;
  transition: opacity 0.5s;
  appearance: none;
  border-radius: 10px;
  cursor: pointer;

  &::-webkit-slider-thumb {
    opacity: 0;
  }
  &::-webkit-slider-runnable-track {
    height: 6px;
    width: 100%;
    border-radius: 10px;
    background: linear-gradient(to right, #f7f7f7 0%, #f7f7f7 calc(${progress}%), #444 calc(${progress}%), #444 100%);
    opacity: 0.7;
  }
  &::-moz-range-thumb {
    opacity: 0;
  }
  &::-moz-range-track {
    height: 6px;
    width: 100%;
    border-radius: 10px;
    background: linear-gradient(to right, #f7f7f7 0%, #f7f7f7 calc(${progress}%), #444 calc(${progress}%), #444 100%);
    opacity: 0.7;
  }
`;
export const s_playerBarTimeLineRange = css`
  width: 100%;
`;
export const s_playerBarController = css`
  display: grid;
  row-gap: 5px;
  grid-template-columns: repeat(3, 1fr);
  > div {
    display: flex;
    width: 100%;
    align-items: center;
    > * {
      cursor: pointer;
    }
  }
  > div:nth-of-type(2) {
    justify-content: center;
  }
  > div:nth-of-type(3) {
    justify-content: flex-end;
    column-gap: 1.5px;
  }
`;

export const s_iconButton = (theme: Theme) => css`
  color: ${theme.colors.dark};
  @media (max-width: 768px) {
    width: 16px;
    height: 16px;
    font-size: 16px;
  }
  @media (min-width: 768px) {
    width: 20px;
    height: 20px;
    font-size: 20px;
  }
`;
