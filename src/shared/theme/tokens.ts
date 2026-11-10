export type ColorScheme = 'light' | 'dark';
export type ThemePreference = 'system' | ColorScheme;

export const brand = {
  name: 'ZATCA Invoice Reader',
  nameAr: 'قارئ فواتير زاتكا',
  teal: '#0B3D3A',
  tealDeep: '#071A19',
  gold: '#C9A227',
  goldSoft: '#E8C547',
  sand: '#F6F1E8',
  cream: '#FFFCF7',
} as const;

export const semanticColors = {
  light: {
    background: '#F6F1E8',
    surface: '#FFFCF7',
    muted: '#EFE8DC',
    header: '#0B3D3A',
    foreground: '#14221F',
    subtle: '#5C6B67',
    inverse: '#FFFCF7',
    line: '#E4D9C8',
    primary: '#0B3D3A',
    accent: '#C9A227',
    accentMuted: '#A6861C',
    online: '#1A7A6D',
    danger: '#C2410C',
    input: '#FFFCF7',
    tabBar: '#FFFCF7',
    icon: '#6B7A75',
  },
  dark: {
    background: '#071A19',
    surface: '#0F2C2A',
    muted: '#061412',
    header: '#0F2C2A',
    foreground: '#F3E9D2',
    subtle: '#A8B5B1',
    inverse: '#F6F1E8',
    line: '#1E3F3C',
    primary: '#E8C547',
    accent: '#E8C547',
    accentMuted: '#C9A227',
    online: '#3DCFB8',
    danger: '#F97316',
    input: '#123330',
    tabBar: '#0F2C2A',
    icon: '#A8B5B1',
  },
} as const;

export type SemanticColors = (typeof semanticColors)[ColorScheme];
