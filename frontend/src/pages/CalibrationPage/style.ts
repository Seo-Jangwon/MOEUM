import { css } from '@emotion/react';

export const s_content = css`
  height: 100%;
  font-size: 2.2rem;
  display: flex;
  margin-top: 4rem;
  justify-content: center;
  text-align: center;
  font-weight: 600;
  line-height: 1.5;
  @media (max-width: 767px) {
    font-size: 1.2rem;
  }
`;

export const s_titlebox = css`
  margin: 70px;
`;

export const s_div_success = css`
  font-size: 4rem;
  font-weight: 700;
  color: #444;
  @media (max-width: 767px) {
    font-size: 2rem;
  }
`;
