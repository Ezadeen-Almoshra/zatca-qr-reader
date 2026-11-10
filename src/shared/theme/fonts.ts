import type { TextStyle } from 'react-native';

export const fonts = {
  regular: 'IBMPlexSansArabic_400Regular',
  medium: 'IBMPlexSansArabic_500Medium',
  semibold: 'IBMPlexSansArabic_600SemiBold',
  bold: 'IBMPlexSansArabic_700Bold',
} as const;

export function fontForWeight(weight: TextStyle['fontWeight'] | undefined) {
  if (
    weight === 'bold' ||
    weight === '700' ||
    weight === '800' ||
    weight === '900' ||
    weight === 700 ||
    weight === 800 ||
    weight === 900
  ) {
    return fonts.bold;
  }
  if (weight === '600' || weight === 600) return fonts.semibold;
  if (weight === '500' || weight === 500) return fonts.medium;
  return fonts.regular;
}
