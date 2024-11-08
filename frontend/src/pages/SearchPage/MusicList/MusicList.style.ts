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
  @media (max-width: 768px) {
    padding: 0 10%;
  }
`;

export const s_elementsContainer = css`
  display: flex;
  width: 100%;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

export const s_firstElement = css`
  display: flex;
  flex-direction: column;
  aspect-ratio: 1/1;
  margin: 5px 0;
  :hover {
    filter: brightness(50%);
    transition: filter 0.3s;
  }
  @media (max-width: 768px) {
    width: 90%;
    justify-content: center;
    align-items: center;
  }
  @media (min-width: 768px) {
    width: 40%;
  }
`;

export const s_firstElementText = css`
  @media (max-width: 768px) {
    padding-top: 5px;
    width: 90%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
`;
export const s_firstElementImage = css`
  width: 90%;
  aspect-ratio: 1/1;
  border-radius: 20px;
`;

export const s_otherElementContainer = css`
  width: 60%;
  display: flex;
  flex-direction: column;
  align-items: center;
  aspect-ratio: 3/2;
  row-gap: 5px;
  @media (max-width: 768px) {
    width: 85%;
  }
`;

export const s_otherElement = css`
  width: 100%;
  aspect-ratio: 6/1;
  justify-content: space-between;
  display: flex;
  cursor: pointer;
  :hover {
    filter: brightness(50%);
    transition: filter 0.3s;
  }
`;

export const s_otherElementLeftChild = css`
  display: flex;
  align-items: center;
  text-align: center;
  width: 50%;
`;

export const s_otherElementImage = css`
  width: 35%;
  aspect-ratio: 1/1;
  margin-right: 5px;
  border-radius: 10px;
`;

export const s_otherElementRightChild = css`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  text-align: center;
  width: 50%;
`;
