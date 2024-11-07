export type Color =
  | 'primary'
  | 'secondary'
  | 'white'
  | 'lightgray'
  | 'background'
  | 'dark'
  | 'gray';

export type ColorType = {
  [key in Color]: string;
};

export interface TypographyType {
  heading: string;
  title: string;
  subTitle: string;
  body: string;
  bodyBold: string;
  detail: string;
  detailBold: string;
}

export interface ThemeType {
  colors: ColorType;
  typography: TypographyType;
}

// emotion.d.ts
declare module '@emotion/react' {
  export type Theme = ThemeType;
}
