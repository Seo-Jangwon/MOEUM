import { css } from "@emotion/react";

export const s_div_item_container = css`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); /* 반응형 칸 너비 */
  gap: 20px;

  @media (max-width: 768px) {
    gap: 10px; /* 모바일에서는 간격 조정 */
  }
`;

export const s_h5 = css`
  /* position: absolute; */
  top: 30%;
  left: 10%;
  font-size: 12px;
  font-weight: 700;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  color: white;
  @media (max-width: 1024px) {
    font-size: 14px;
  }
  @media (max-width: 767px) {
    font-size: 8px;
  }
`;