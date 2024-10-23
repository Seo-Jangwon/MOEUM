import { css } from '@emotion/react';
import { theme } from '@/styles/theme';

export const s_container = css`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  color: ${theme.colors.white};
`;

export const s_primary_ball = css`
  position: absolute;
  left: 10rem;
  bottom: 8rem;
  height: 20rem;
  width: 20rem;
  background-color: ${theme.colors.primary};
  border-radius: 100%;
  mix-blend-mode: screen;
  filter: blur(37.5px);
`;

export const s_secondary_ball = css`
  position: absolute;
  right: 10rem;
  top: 10rem;
  height: 20rem;
  width: 20rem;
  background-color: ${theme.colors.secondary};
  border-radius: 100%;
  mix-blend-mode: screen;
  filter: blur(37.5px);
`;

export const s_content = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  text-align: center;
`;

export const s_titlebox = css`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  ${theme.typography.title};
`;

export const s_form = css`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

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
