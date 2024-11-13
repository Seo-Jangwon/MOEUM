import { Theme, css } from '@emotion/react';

export const s_div_title = (theme: Theme) => css`
  display: flex;
  font-size: 36px;
  font-weight: 800;
  color: ${theme.colors.secondary};
  gap: 18px;
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
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  @media (max-width: 768px) {
    grid-template-columns: repeat(3, minmax(30px, 1fr));
    gap: 6px;
  }
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
  :hover > h5 {
    opacity: 1;
  }
`;

export const s_img = css`
  width: 100%;
  border-radius: 20px;
`;

export const s_h5 = (theme: Theme) => css`
  text-align: center;
  font-size: 16px;
  font-weight: 800;
  color: ${theme.colors.primary};
`;
