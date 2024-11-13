import { Theme, css } from '@emotion/react';

export const s_container = css`
  display: flex;
  width: 75%;
  flex-direction: column;
  margin: 0 auto;
`;

export const s_div_title = (theme: Theme) => css`
  color: ${theme.colors.white};
  font-size: 48px;
  font-weight: 800;
  margin-top: 20px;
`;

export const s_p = (theme: Theme) => css`
  color: ${theme.colors.lightgray};
  font-size: 12px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

export const s_div_container = css`
  margin-top: 20px;
`;

export const s_div_item = css`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid white;
  align-items: center;
  padding: 10px 0;
  
`;

export const s_div_titie_img = css`
  display: flex;
  align-items: center;
  width: 40%;
  :hover > div > img {
    filter: brightness(50%);
    transition: 0.3s;
  }
`;

export const s_div_img = css`
  width: 40px;
  height: 40px;
  margin-right: 20px;
  flex-shrink: 0;
`;

export const s_img = css`
  width: 100%;
  height: 100%;
  padding: 2px;
  border-radius: 8px;
`;

export const s_h4 = (theme: Theme) => css`
  font-size: 16px;
  color: ${theme.colors.white};
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;