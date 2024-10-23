import { css } from '@emotion/react';

export const HeaderDiv = css`
  @media (max-width: 768px) {
    display: none;
  }
  display: flex;
  justify-content: space-between;
  padding: 20px 50px;
`;

export const HeaderImageButtonStyle = css`
  padding: 0 10px;
  :hover {
    cursor: pointer;
  }
`;
