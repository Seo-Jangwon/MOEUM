import { Theme, css } from '@emotion/react';


export const s_li = (theme: Theme) => css`
  display: flex;
  align-items: center;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
  color: ${theme.colors.white};
  &:hover {
    background-color: #555;
    transition: 0.3s;
  }
`;
