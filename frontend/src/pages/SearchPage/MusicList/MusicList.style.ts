import { css, Theme } from '@emotion/react';

export const s_container = css`
  width: 60%;
  height: 35vh;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

export const s_titleContainer = css`
  display: flex;
  justify-content: space-between;
  text-align: center;
`;

export const s_elementsContainer = css`
  display: flex;
  width: 100%;
`;

export const s_firstElement = (theme: Theme) => css`
  width: 40%;
  display: flex;
  flex-direction: column;
  height: 100%;
`;
export const s_firstElementImage = css`
  width: 25vh;
  height: 25vh;
  border-radius: 20px;
`;

export const s_otherElementContainer = css`
  width: 60%;
  height: 25vh;
`;

export const s_otherElement = (theme: Theme) => css`
  width: 100%;
  justify-content: space-between;
  display: flex;
  height: 25%;
`;

export const s_otherElementLeftChild = css`
  display: flex;
  align-items: center;
  height: 100%;
  width: 50%;
  text-align: center;
`;

export const s_otherElementImage = css`
  height: 6vh;
  width: 6vh;
  margin-right: 5px;
  border-radius: 10px;
`;

export const s_otherElementRightChild = css`
  display: flex;
  align-items: center;
  text-align: right;
  width: 50%;
`;
