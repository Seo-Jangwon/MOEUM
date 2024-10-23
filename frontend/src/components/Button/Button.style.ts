import { css } from '@emotion/react';
import { ButtonType } from './Button.type';
import { theme } from '@/styles/theme';

const ButtonStyles = {
  grad: css`
    color: ${theme.colors.white};
    background: linear-gradient(90deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%);
  `,
  primary: css``,
  secondary: css``,
  outline: css``,
  danger: css``,
};

export const buttonStyle = (type: ButtonType) => css`
  padding: 0.5rem 2.5rem;
  font-size: large;
  border-radius: 10px;
  ${ButtonStyles[type]};
`;
