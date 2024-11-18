import { css } from '@emotion/react';

export const s_container = (cover: string) => css`
  display: flex;
  height: 320px;
  padding: 10px 20px;
  width: 100%;
  justify-content: space-between;
  align-items: flex-end;
  border-radius: 32px 32px 0px 0px;
  background:
    linear-gradient(0deg, rgba(23, 23, 23, 0.4) 0%, rgba(23, 23, 23, 0.4) 100%),
    url(${cover}) lightgray 50% / cover no-repeat;

  & button {
    background: none;
    border: none;
  }
`;

export const s_article = css`
  display: flex;
  align-items: end;
  width: 100%;
  justify-content: space-between;
`;

export const s_title = css`
  color: #f7f7f7;
  font-size: 48px;
  font-style: normal;
  font-weight: 800;
  line-height: normal;
`;

export const s_playButton = css`
  svg {
    transition: ease-in-out 0.3s;
    :hover {
      transform: scale(1.2);
      filter: brightness(0.8);
    }
  }
`;
