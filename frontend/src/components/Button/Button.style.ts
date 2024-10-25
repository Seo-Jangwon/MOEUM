import { css, Theme } from '@emotion/react';
import { ButtonType } from './Button.type';

const ButtonStyles = (theme: Theme) => ({
  grad: css`
    color: #f7f7f7;
    border: 0;
    background: linear-gradient(90deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%);
  `,
  primary: css`
    color: #aaaaaa;
  `,
  secondary: css``,
  outline: css``,
  danger: css``,
});

export const buttonStyle = (theme: Theme, type: ButtonType) => css`
  padding: 0.5rem 2.5rem;
  cursor: pointer;
  border-radius: 10px;
  ${ButtonStyles(theme)[type]};
`;
