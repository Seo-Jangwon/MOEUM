import { css, Theme } from '@emotion/react';
import { ButtonVariants } from './Button.type';

const ButtonStyles = (theme: Theme) => ({
  // 버튼의 경우에는 전역 테마의 영향을 받지 않도록 상수로 설정
  grad: css`
    color: #f7f7f7;
    border: 0;
    background: linear-gradient(90deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%);
  `,
  inverted: css`
    color: ${theme.colors.dark};
    border: 0;
    background-color: ${theme.colors.white};
  `,
  outline: css`
    color: ${theme.colors.lightgray};
    background: transparent;
    border: 1px solid ${theme.colors.lightgray};
  `,
  danger: css`
    color: #f7f7f7;
    border: 0;
    background: linear-gradient(90deg, #f73030 0%, ${theme.colors.primary} 100%);
  `,
});

export const buttonStyle = (theme: Theme, variant: ButtonVariants) => css`
  padding: 5px 20px;
  font-size: large;
  font-weight: 600;
  transition: 0.5s ease;

  border-radius: 10px;
  ${ButtonStyles(theme)[variant]};
`;
