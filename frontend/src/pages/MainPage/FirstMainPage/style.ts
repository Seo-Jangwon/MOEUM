import { Theme, css } from '@emotion/react';

export const s_h2 = (theme: Theme) => css`
  font-size: 2rem;
  text-align: center;
  color: ${theme.colors.white};
  font-weight: 700;
  line-height: 1.1;
  @media (max-width: 767px) {
    font-size: 2rem;
  }
`;

export const s_div_selector = () => css`
  display: flex;
  justify-content: space-around;
  align-items: center;
`;
export const s_p = (theme: Theme) => css`
  font-size: 24px;
  color: ${theme.colors.lightgray};
  @media (max-width: 767px) {
    font-size: 1rem;
  }
`;

export const s_div_img = css`
  position: relative;
  width: 15vw;
  height: 13vw;
  margin: 1vw;

  &:hover .play-icon {
    transform: scale(1);
  }
  @media (max-width: 767px) {
    width: 25vw;
    height: 20vw;
  }
`;

export const s_div_button = (theme: Theme) => css`
  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 4rem;
  background-color: ${theme.colors.lightgray};
  border-radius: 24px;
  border: 0;
  padding: 0;
  width: 12vw;
  height: 10vw;
  border-radius: 24px;
  overflow: clip;
  color: ${theme.colors.white};
  @media (max-width: 767px) {
    width: 25vw;
    height: 20vw;
  }
`;

export const s_div_musicList = css`
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  justify-content: center;
  margin: -20px 0;
`;
