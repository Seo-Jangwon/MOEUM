import { css } from '@emotion/react';

export const s_container = css`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
`;

export const s_videoContainer = css`
  @media (max-width: 768px) {
    width: 90%;

    flex-direction: column;
    align-items: center;
    display: flex;
    aspect-ratio: 16/9;
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
  height: 5%;
  background-color: orange;
  opacity: 0.5;
  display: flex;
  align-items: center;
  bottom: 0;
  left: 0;
  width: 100%;
`;
