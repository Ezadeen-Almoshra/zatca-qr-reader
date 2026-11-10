import { vars } from 'nativewind';
import { semanticColors, type ColorScheme, type SemanticColors } from './tokens';

function toCssVars(colors: SemanticColors) {
  return vars({
    '--color-background': colors.background,
    '--color-surface': colors.surface,
    '--color-muted': colors.muted,
    '--color-header': colors.header,
    '--color-foreground': colors.foreground,
    '--color-subtle': colors.subtle,
    '--color-inverse': colors.inverse,
    '--color-line': colors.line,
    '--color-primary': colors.primary,
    '--color-accent': colors.accent,
    '--color-accent-muted': colors.accentMuted,
    '--color-online': colors.online,
    '--color-danger': colors.danger,
    '--color-input': colors.input,
    '--color-tab-bar': colors.tabBar,
    '--color-icon': colors.icon,
  });
}

export const themeVars: Record<ColorScheme, ReturnType<typeof vars>> = {
  light: toCssVars(semanticColors.light),
  dark: toCssVars(semanticColors.dark),
};
