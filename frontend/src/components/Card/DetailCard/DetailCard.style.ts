import { css, Theme } from '@emotion/react';

export const s_detailCard = css`
  display: flex;
  flex-direction: column;
  width: 160px;
`;

export const s_detailCardImage = css`
  object-fit: cover;
  width: 160px;
  height: 160px;
  border-radius: 12px;
`;

export const s_detailCardPlayIcon = css``;

export const s_detailCardLabel = (theme: Theme) => css`
  overflow: hidden;
  width: 160px;
  font-size: 14px;
  padding: 4px;
  padding-top: 8px;
  color: ${theme.colors.white};
  font-weight: 600;
  text-wrap: nowrap;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
