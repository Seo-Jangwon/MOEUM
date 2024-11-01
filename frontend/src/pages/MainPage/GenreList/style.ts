import { Theme, css } from '@emotion/react';

export const s_div_title = (theme: Theme) => css`
  display: flex;
  font-size: 36px;
  font-weight: 800;
  color: ${theme.colors.secondary};
  gap: 18px;
  @media (max-width: 1024px) {
    font-size: 30px;
  }
  @media (max-width: 767px) {
    font-size: 24px;
  }
`;

export const s_div_item_container = css`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
`;

export const s_div_item_box = css`
  position: relative;
  border: 0;
  overflow: hidden;
  background: transparent;
  :hover {
    transition: 0.3s;
    filter: brightness(50%);
  }
`;

export const s_img = css`
  width: 100%;
  border-radius: 20px;
`;

export const s_h5 = (theme: Theme) => css`
  position: absolute;
  top: 50%;
  left: 50%;
  font-size: 300%;
  font-weight: 800;
  transform: translate(-50%, -50%);
  color: ${theme.colors.primary};
  @media (max-width: 1024px) {
    font-size: 100%;
  }
`;
