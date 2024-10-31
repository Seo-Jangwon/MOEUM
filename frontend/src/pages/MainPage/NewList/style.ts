import { Theme, css } from '@emotion/react';


export const s_div_header = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const s_div_h3 = (theme: Theme) => css`
  display: flex;
  align-items: center;
  gap: 18px;
  font-size: 48px;
  color: ${theme.colors.white};
  font-weight: 800;
  @media (max-width: 1024px) {
    font-size: 36px;
  }
  @media (max-width: 767px) {
    font-size: 24px;
  }
  
`;

export const s_button = (theme: Theme) => css`
  background: none;
  border: none;
  color: ${theme.colors.white};
  font-size: 24px;
  cursor: pointer;
  margin-left: 10px;

  &:disabled {
    color: ${theme.colors.gray};
    cursor: not-allowed;
  }
`;

export const s_play_button = css`
  background: transparent;
  border: 0;
  position: relative;
  width: 100%;
  padding: 0;
  cursor: pointer;
  :hover .icon {
    opacity: 1;
  }
  :hover > img {
    filter: brightness(0.5);
    transition: 0.3s;
  }
`;

export const s_div_list = css`
  display: flex;
  overflow-x: auto;
  gap: 40px;
  margin-top: 20px;
  scroll-behavior: smooth;
  padding-bottom: 10px;
`;

export const s_div_img = css`
  display: flex;
  flex-direction: column;
  flex: 0 0 calc((100% - (4 * 40px)) / 5);

  flex-shrink: 0;
  /* text-align: center; */

  @media (max-width: 1200px) {
    flex: 0 0 calc((100% - (3 * 40px)) / 4);
  }

  @media (max-width: 900px) {
    flex: 0 0 calc((100% - (2 * 40px)) / 3);
  }
`;

export const s_img = css`
  width: 100%;
  border-radius: 24px;
`;

export const s_p = (theme: Theme) => css`
  color: ${theme.colors.white};
  font-weight: 600;
  font-size: 24px;
  padding-bottom: 5px;
`;

export const s_icon = (theme: Theme) => css`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: ${theme.colors.white};
  font-size: 48px;
  opacity: 0;
  transition: 0.2s;
  :hover {
    scale: 1.05;
  }
`;

export const s_lottie = (theme: Theme) => css`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 50%;
  height: 50%;
  transform: translate(-50%, -50%);
  color: #341232;
`;


