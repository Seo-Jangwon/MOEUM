export const FONT_SIZES = {
  xxxl: '3.2rem',
  xxl: '2.8rem',
  xl: '2.4rem',
  l: '2rem',
  m: '1.8rem',
  s: '1.6rem',
  xs: '1.4rem',
  xxs: '1.2rem',
} as const;

export const TYPOGRAPHY = {
  heading: `
      font-weight: 700;
      font-size: ${FONT_SIZES.xxxl};
      line-height: ${FONT_SIZES.xxxl};
    `,
  title: `
      font-weight: 700;
      font-size: ${FONT_SIZES.xl};
      line-height: ${FONT_SIZES.xl};
    `,
  subTitle: `
      font-weight: 700;
      font-size: ${FONT_SIZES.l};
      line-height: ${FONT_SIZES.l};
    `,
  body: `
      font-weight: 400;
      font-size: ${FONT_SIZES.s};
      line-height:  ${FONT_SIZES.s};
    `,
  bodyBold: `
      font-weight: 700;
      font-size: ${FONT_SIZES.s};
      line-height: ${FONT_SIZES.s};
    `,
  detail: `
      font-weight: 400;
      font-size: ${FONT_SIZES.xxs};
      line-height:  ${FONT_SIZES.xxs};
    `,
  detailBold: `
      font-weight: 700;
      font-size: ${FONT_SIZES.xxs};
      line-height:${FONT_SIZES.xxs};
    `,
} as const;
