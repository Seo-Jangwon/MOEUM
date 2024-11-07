import { css } from '@emotion/react';

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

export const s_playerBar = css`
  position: absolute;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  bottom: 0;
  left: 0;
  width: 100%;
  > div {
    width: 95%;
    margin: 0 2.5%;
  }
`;

export const s_playerBarRange = (progress: number) => css`
  width: 100%;
  height: 6px;
  background: #ddd;
  opacity: 0.7;
  transition: opacity 0.2s;
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
    background: linear-gradient(
      to right,
      #f7f7f7 0%,
      #f7f7f7 calc(${progress}%),
      #444 calc(${progress}%),
      #444 100%
    );
    opacity: 1;
  }
`;
export const s_playerBarTimeLineRange = css`
  width: 100%;
`;
export const s_playerBarController = css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  > div {
    display: flex;
    width: 100%;
    align-items: center;
  }
  > div:nth-of-type(2) {
    justify-content: center;
  }
  > div:nth-of-type(3) {
    justify-content: flex-end;
  }
`;

export const s_iconButton = css`
  width: 25px;
  height: 25px;
  font-size: 25px;
`;
