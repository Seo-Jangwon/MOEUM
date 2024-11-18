import { css } from '@emotion/react';

export const s_container = css`

  padding: 20px 5px;
  background-color: #444;
  @media (max-width: 768px) {
    width: 95%;
    padding-top: 30px;
  }
  @media (min-width: 768px) {
    flex-grow: 1;
  }
  row-gap: 10px;
  display: flex;
  flex-direction: column;
`;

export const s_playListTitle = css`
  padding-left: 5%;
  font-size: 20px;
`;
