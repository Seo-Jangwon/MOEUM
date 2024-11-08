import { css } from '@emotion/react';

export const s_container = css`
  display: flex;
  flex-direction: column;
  word-break: break-all;
  @media (max-width: 768px) {
    width: 90%;
  }
  @media (min-width: 768px) {
    width: 60%;
  }
`;

export const s_titleContainer = css`
  display: flex;
  justify-content: space-between;
  font-size: 20px;
  text-align: center;
  margin-bottom: 20px;
  @media (max-width: 768px) {
    padding: 0 10%;
  }
`;
export const s_elementsContainer = css`
  display: grid;
  width: 100%;
  @media (max-width: 768px) {
    grid-template-rows: 1fr 1fr;
    grid-template-columns: 1fr 1fr;
  }
  @media (min-width: 768px) {
    grid-template-rows: 1fr;
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
  row-gap: 25px;
`;

export const s_elementContainer = css`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  :hover {
    filter: brightness(50%);
    transition: filter 0.3s;
  }
`;

export const s_elementImage = (isBorder: boolean) => css`
  width: 80%;
  aspect-ratio: 1/1;
  border-radius: ${isBorder ? '100%' : '10px'};
`;
