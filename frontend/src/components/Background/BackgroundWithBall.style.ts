import { css, Theme } from '@emotion/react';

export const s_primary_ball = (theme: Theme) => css`
  position: absolute;
  left: 8rem;
  bottom: 8rem;
  height: 20rem;
  width: 20rem;
  background-color: ${theme.colors.primary};
  border-radius: 100%;
  mix-blend-mode: screen;
  filter: blur(37.5px);
`;

export const s_secondary_ball = (theme: Theme) => css`
  position: absolute;
  right: 8rem;
  top: 10rem;
  height: 20rem;
  width: 20rem;
  background-color: ${theme.colors.secondary};
  border-radius: 100%;
  mix-blend-mode: screen;
  filter: blur(37.5px);
`;
