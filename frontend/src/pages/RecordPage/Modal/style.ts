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
`;
