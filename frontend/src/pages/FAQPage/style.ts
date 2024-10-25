import { css } from '@emotion/react';

export const FAQPageStyle = css`
  background-color: #171717;
`;
export const TitleTextStyle = css`
  font-size: 36px;
  color: white;
  text-align: center;
  padding: 30px 0 40px 0;
`;
export const FAQBody = css`
  display: flex;
`;
export const CardBody = css`
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
`;
