import { theme } from '@/styles/theme';
import { css } from '@emotion/react';

export const s_input = css`
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
