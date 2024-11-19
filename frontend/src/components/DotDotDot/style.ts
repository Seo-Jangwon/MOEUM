import { Theme, css } from '@emotion/react';

export const s_container = css`
  display: inline;
  position: relative;
`;

export const s_icon = (theme: Theme) => css`
  color: ${theme.colors.white};
  font-size: 30px;

  :hover {
    transform: scale(1.2);
    transition: 0.3s;
    cursor: pointer;
  }
`;

export const s_contentList = css`
  position: absolute;
  background-color: #444;
  white-space: nowrap;
  padding: 10px;
  border-radius: 8px;
  margin: 0;
  list-style: none;
  z-index: 1;
`;
