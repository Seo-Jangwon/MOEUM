import { css, Theme } from '@emotion/react';

export const s_errorMain = css`
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100% - 80px);
`;

export const s_errorArticle = (theme: Theme) => css`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 48px;

  h1 {
    color: ${theme.colors.white};
    font-size: 42px;
    font-weight: 800;

    @media (max-width: 768px) {
      font-size: 28px;
    }
  }
`;

export const s_errorLogo = css`
  width: 72px;
  height: 72px;
`;
