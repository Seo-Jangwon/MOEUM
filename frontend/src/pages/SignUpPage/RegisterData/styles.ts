import { css } from '@emotion/react';
import { theme } from '@/styles/theme';

export const s_input = css`
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
