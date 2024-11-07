import { css, Theme } from '@emotion/react';

export const s_container = (theme: Theme) => css`
  color: ${theme.colors.white};
  @media (max-width: 768px) {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 2.5% 62.5% 35%;
  }
`;
