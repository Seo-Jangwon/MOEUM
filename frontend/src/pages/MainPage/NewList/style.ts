import { css } from '@emotion/react';

export const s_div_list = css`
  overflow-x: auto;
  white-space: nowrap;
  display: flex;
  gap: 10px;
  padding: 10px;
`;

export const s_div_img = css`
  width: 250px;
  height: 200px;
  flex-shrink: 0;
  overflow: hidden;
  position: relative; /* 텍스트를 이미지 위에 겹치도록 설정 */
  border-radius: 8px;
  text-align: center;
`;

export const s_img = css`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

export const s_div_h3 = css`
  font-size: 24px;
  color: white;
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
  z-index: 1;
  background-color: rgba(0, 0, 0, 0.5); /* 반투명 배경을 추가하여 텍스트 가독성 높이기 */
  padding: 5px 10px;
  border-radius: 4px;
`;
