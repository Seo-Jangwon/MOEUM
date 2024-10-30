import { css } from '@emotion/react';

export const s_button = css`
  position: relative;
  background: none;
  border: 0;
  padding: 0;
  width: 12vw;
  height: 10vw;
  border-radius: 24px;
  overflow: clip;
  :hover img {
    filter: brightness(0.5);
  }
  &:hover .play-icon {
    opacity: 1;
  }
  @media (max-width: 767px) {
    width: 25vw;
    height: 20vw;
  }
`;

export const s_img = css`
  
  width: 100%;
  height: 100%;
  transition: 0.2s ease;
`;

export const s_icon = css`
  position: absolute;
  bottom: 20px;
  left: 20px;
  color: white;
  font-size: 24px;
  opacity: 0;
  transition: 0.2s ease;
  :hover{
    transform: scale(1.2);
  }
`;
