import { DARK_PALETTE, LIGHT_PALETTE, TYPOGRAPHY } from '@/styles/tokens';

export const theme = (isLightMode: boolean) => ({
  colors: isLightMode ? LIGHT_PALETTE : DARK_PALETTE,
  typography: TYPOGRAPHY,
});
