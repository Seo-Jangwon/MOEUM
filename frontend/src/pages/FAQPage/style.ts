import { css, Theme } from '@emotion/react';

export const s_FAQPage = (theme: Theme) => css`
  background-color: ${theme.colors.background};
`;
export const s_TitleText = (theme: Theme) => css`
  @media (max-width: 677px) {
    font-size: 24px;
  }
  @media (min-width: 678px) {
    font-size: 36px;
  }
  color: ${theme.colors.white};
  text-align: center;
  padding: 30px 0 40px 0;
`;
export const s_BodyContainer = css`
  display: grid;
  align-items: center;
  justify-content: center;
  padding: 0 20vw;
  place-items: center;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr;
  @media (max-width: 767px) {
    padding: 0 10vw;
  }
  margin: 0 0 30px 0;
`;

export const s_1vs1Container = css`
  flex-direction: column;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin: 20px 0;
`;

export const s_1vs1text = (theme: Theme) => css`
  color: ${theme.colors.lightgray};
  padding: 5px 0;
`;

export const s_1vs1textWithAnchor = (theme: Theme) => css`
  color: ${theme.colors.lightgray};
  padding: 5px 0;
  :hover {
    cursor: pointer;
  }
`;
