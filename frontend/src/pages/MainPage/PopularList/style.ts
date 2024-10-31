import { css, Theme } from '@emotion/react';

export const s_div_h3 = (theme: Theme) => css`
  display: flex;
  align-items: center;
  gap: 18px;
  font-size: 48px;
  color: ${theme.colors.primary};
  font-weight: 800;
  @media (max-width: 1024px) {
    font-size: 36px;
  }
  @media (max-width: 767px) {
    font-size: 24px;
  }
`;

export const s_popular_container = css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
`;

export const s_popular_box = (theme: Theme) => css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${theme.colors.gray};
  border-radius: 20px;
  height: 120px;
`;

export const s_div_data = css`
  display: flex;
  flex-direction: column;
  margin: 2%;
  text-align: right;
  gap: 2px;
`;

export const s_h5_title = (theme: Theme) => css`
  font-size: 120%;
  font-weight: 800;
  color: ${theme.colors.white};
`;

export const s_p_artist = css`
  font-size: 105%;
  font-weight: 700;
  color: #aaa;
`;
