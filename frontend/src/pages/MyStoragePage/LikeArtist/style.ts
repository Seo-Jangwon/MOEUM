import { css } from "@emotion/react";

export const s_div_item_container = css`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); /* 반응형 칸 너비 */
  gap: 20px;

  @media (max-width: 768px) {
    gap: 10px; /* 모바일에서는 간격 조정 */
  }
`;