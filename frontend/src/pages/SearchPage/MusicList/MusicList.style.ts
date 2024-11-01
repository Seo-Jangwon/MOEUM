import { css, Theme } from '@emotion/react';

export const s_container = (theme: Theme) => css`
  color: ${theme.colors.white};
  display: flex;
  flex-direction: column;
  padding-bottom: 20px;
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
`;

export const s_elementsContainer = css`
  display: flex;
  width: 100%;
  aspect-ratio: 1/2;
`;

export const s_firstElement = css`
  width: 40%;
  display: flex;
  flex-direction: column;
  aspect-ratio: 1/1;
  @media (max-width: 768px) {
    width: 80%;
  }
`;
export const s_firstElementImage = css`
  width: 80%;
  aspect-ratio: 1/1;
  border-radius: 20px;
`;

export const s_otherElementContainer = css`
  width: 60%;
  height: 100%;
`;

export const s_otherElement = css`
  width: 100%;
  justify-content: space-between;
  display: flex;
  height: 25%;
`;

export const s_otherElementLeftChild = css`
  display: flex;
  align-items: center;
  height: 100%;
  aspect-ratio: 1/1;
  text-align: center;
`;

export const s_otherElementImage = css`
  height: 25%;
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
