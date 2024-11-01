import { css, Theme } from '@emotion/react';

export const s_container = (theme: Theme) => css`
  display: flex;
  color: ${theme.colors.white};
  flex-direction: column;
  width: 100%;
  justify-content: center;
  align-items: center;
  row-gap: 20px;
`;
