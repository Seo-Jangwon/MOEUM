import { css, Theme } from '@emotion/react';

export const s_container = css``;

export const s_titleContainer = (theme: Theme) => css`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 10vh;
  color: ${theme.colors.white};
  font-weight: 600;
  @media (max-width: 768px) {
    font-size: 32px;
    margin-bottom: 3vh;
  }
  @media (min-width: 768px) {
    font-size: 40px;
    margin-bottom: 10vh;
  }
`;

export const s_componentsContainer = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;
