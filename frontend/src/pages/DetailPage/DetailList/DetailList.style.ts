import { css, Theme } from '@emotion/react';

export const s_container = css`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 48px;
`;

export const s_heading = css`
  display: flex;
  justify-content: space-between;
`;

export const s_title = (theme: Theme) => css`
  font-size: 36px;
  font-weight: 800;
  color: ${theme.colors.white};
`;

export const s_listContainer = css`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

export const s_li = (theme: Theme) => css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-variant-numeric: lining-nums tabular-nums;

  color: ${theme.colors.white};
`;

export const s_liTitle = css`
  display: flex;
  font-size: 18px;
  font-weight: 600;
  :hover {
    filter: brightness(0.5);
  }
`;

export const s_liTime = css`
  color: #444;
  text-align: right;
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;
