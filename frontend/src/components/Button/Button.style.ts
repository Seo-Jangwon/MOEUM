import { css, Theme } from '@emotion/react';
import { ButtonVariants } from './Button.type';

const ButtonStyles = (theme: Theme) => ({
  // 버튼의 경우에는 전역 테마의 영향을 받지 않도록 상수로 설정
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

export const buttonStyle = (theme: Theme, variant: ButtonVariants) => css`
  padding: 0.5rem 2.5rem;
  cursor: pointer;
  border-radius: 10px;
  ${ButtonStyles(theme)[variant]};
`;
