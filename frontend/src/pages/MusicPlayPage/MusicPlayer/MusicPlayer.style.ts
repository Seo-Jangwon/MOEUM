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
    display: flex;
    justify-content: center;
    align-items: center;
    width: 95%;
  }
`;

export const s_playerBarRange = css``;
export const s_playerBarTimeLineRange = css`
  width: 100%;
`;
export const s_playerBarController = css`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;
