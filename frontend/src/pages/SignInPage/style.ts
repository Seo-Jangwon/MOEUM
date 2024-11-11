import { css, Theme } from '@emotion/react';
import styled from '@emotion/styled';

export const s_container = (theme: Theme) => css`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 48px;
  color: ${theme.colors.white};
`;

export const s_content = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  text-align: center;
`;

export const s_button = css({ fontSize: 'x-large', marginTop: '24px', padding: '10px 20px' });

export const s_titlebox = (theme: Theme) => css`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  ${theme.typography.title};
`;

export const s_form = css`
  display: flex;
  width: 30rem;
  flex-direction: column;
  gap: 10px;
`;

export const s_input = (theme: Theme) => css`
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

export const s_links = (theme: Theme) => css`
  display: flex;
  gap: 8px;
  font-weight: 600;
  a {
    text-decoration: none;
    color: ${theme.colors.white};
  }
`;

export const s_oauth_box = css`
  display: flex;
  width: 30rem;
  gap: 28px;
  justify-content: center;
  flex-direction: column;
`;

export const Line = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.colors.lightgray};
  height: 0.5px;
`;

export const s_line_text = (theme: Theme) => css`
  display: flex;
  gap: 12px;
  color: ${theme.colors.lightgray};
  align-items: center;
`;
