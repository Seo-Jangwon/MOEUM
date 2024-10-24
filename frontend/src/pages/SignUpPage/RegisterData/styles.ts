import { css, Theme } from '@emotion/react';

export const s_input = (theme: Theme) => css`
  width: 490px;
  height: 53px;
  border: 1px solid ${theme.colors.white};
  background-color: transparent;
  border-radius: 14px;
  color: ${theme.colors.white};
  font-size: 24px;
  text-indent: 24px;
  outline: none;

  ::placeholder {
    color: ${theme.colors.white};
    font-size: 24px;
    text-indent: 24px;
  }

  :focus {
    border-color: ${theme.colors.white};
  }
`;

export const s_button = css`
  position: absolute;
  top: 5px;
  bottom: 5px;
  right: 5px;
  border-radius: 15px;
`;

export const s_div_warning = css`
  color: red;
  font-size: 16px;
  display: flex;
  height: 100%;
  padding: 10px;
  
`

export const s_main = css`
  position: relative;
  gap: 5px;
`;

export const s_icon_yes = css`
  position: absolute;
  top: 10px;
  right: 10px;
  color: green;
  font-size: 30px;
`;

// 나중에 extends 사용해서 줄이기
export const s_icon_no = css`
  position: absolute;
  top: 10px;
  right: 10px;
  color: red;
  font-size: 30px;
`;
