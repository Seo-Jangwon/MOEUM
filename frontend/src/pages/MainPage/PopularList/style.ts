import { css, Theme } from '@emotion/react';

export const s_div_h3 = (theme: Theme) => css`
  display: flex;
  align-items: center;
  gap: 18px;
  font-size: 36px;
  color: ${theme.colors.primary};
  font-weight: 800;
  @media (max-width: 1024px) {
    font-size: 30px;
    gap: 12px;
  }
  @media (max-width: 767px) {
    font-size: 24px;
    gap: 6px;
  }
  @media (max-width: 500px) {
    font-size: 18px;
    gap: 6px;
  }
`;

export const s_popular_container = css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  @media (max-width: 767px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const s_popular_box = (theme: Theme) => css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${theme.colors.gray};
  border-radius: 20px;
  height: 120px;

  :hover > div > div > img {
    filter: brightness(50%);
    transition: 0.3s;
  }
  :hover > div > div > .icon {
    opacity: 1;
  }
  @media (max-width: 767px) {
    border-radius: 10px;
    height: 60px;
  }
`;

export const s_div_data = css`
  display: flex;
  flex-direction: column;
  margin: 2%;
  text-align: right;
  gap: 2px;
  width: 60%;
`;

export const s_h5_title = (theme: Theme) => css`
  font-size: 120%;
  font-weight: 800;
  color: ${theme.colors.white};
  @media (max-width: 1024px) {
    font-size: 80%;
  }
  @media (max-width: 767px) {
    font-size: 60%;
  }
`;

export const s_p_artist = css`
  font-size: 105%;
  font-weight: 700;
  color: #aaa;
  @media (max-width: 1024px) {
    font-size: 75%;
  }
  @media (max-width: 767px) {
    font-size: 55%;
  }
`;
