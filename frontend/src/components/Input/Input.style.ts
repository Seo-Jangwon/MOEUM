import { css, Theme } from '@emotion/react';

export const s_input = (theme: Theme) => css`
  width: 30rem;
  padding: 0.75rem 1.5rem;
  font-size: x-large;
  color: ${theme.colors.white};
  border-radius: 0.875rem;
  background: transparent;
  border: 2px solid ${theme.colors.white};
  ::placeholder {
    color: ${theme.colors.white};
  }
`;
