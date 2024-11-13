import { css, Theme } from '@emotion/react';

export const s_div_h3 = css`
  display: flex;
  gap: 18px;
  font-size: 36px;
  color: #30f751;
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

export const s_div_item_container = css`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  @media (max-width: 767px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
`;

export const s_div_item_box = (lala: string) => css`
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  height: 100px;
  border-radius: 10px;
  @media (max-width: 768px) {
    height: 45px;
  }
  /* background-image: linear-gradient(rgba(0, 0, 255, 0.5), rgba(255, 255, 0, 0.5)), url(${lala}); */
`;

export const s_h5 = (theme: Theme) => css`
  font-size: 18px;
  font-weight: 700;
  color: ${theme.colors.white};
  @media (max-width: 1024px) {
    font-size: 14px;
  }
  @media (max-width: 767px) {
    font-size: 8px;
  }
`;
