import { css } from '@emotion/react';

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
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
`;

export const s_div_item_box = () => css`
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  height: 100px;
  border-radius: 10px;
  @media (max-width: 768px) {
    height: 45px;
  }
`;

export const s_h5 = css`
  position: absolute;
  top: 30%;
  left: 10%;
  font-size: 24px;
  font-weight: 700;
  text-overflow: ellipsis;
  color: white;
  @media (max-width: 1024px) {
    font-size: 14px;
  }
  @media (max-width: 767px) {
    font-size: 8px;
  }
`;

export const s_icon_div = css`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1;
  :hover {
    background-color: #888;
    border-radius: 100%;
  }
`;

export const s_div_button = css`
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
  border: none;
  background: transparent;
  :hover {
    transition: 0.3s;
    filter: brightness(0.5);
  }
  border-radius: 20px;
  @media (max-width: 768px) {
    border-radius: 10px;
  }
`;

export const s_coverImage = css`
  width: 100%;
  height: 100%;
  border-radius: 20px;
  object-fit: cover;
  filter: brightness(0.8);
`;
