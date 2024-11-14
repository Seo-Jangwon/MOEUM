import { css } from '@emotion/react';

export const s_modal_container = css`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
`;

export const s_modal_box = css`
  background-color: #444;
  color: white;
  padding: 20px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  width: 30%;
  height: 50%;
  gap: 20px;
  overflow-y: scroll;
  position: relative;
`;

export const s_div_playlist_item_container = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  :hover > div > img {
    filter: brightness(50%);
    transition: 0.3s;
  }
`;

export const s_div_img = css`
  width: 50px;
  overflow: hidden;
`;

export const s_img = css`
  width: 100%;
  border-radius: 10px;
`;

export const s_playlist_data = css`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-size: 14px;
`;

export const s_button = css`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
`;

export const s_button_input = css`
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

export const s_button_position = css`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

export const s_plus_button = css`
  position: absolute;
  bottom: 10px;
  right: 10px;
`;
