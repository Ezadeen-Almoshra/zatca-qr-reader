import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { colorScheme as nativewindScheme } from 'nativewind';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme, View } from 'react-native';
import { storage } from '@/shared/services/storage';
import {
  semanticColors,
  type ColorScheme,
  type SemanticColors,
  type ThemePreference,
} from './tokens';
import { themeVars } from './vars';

interface ThemeContextValue {
  preference: ThemePreference;
  colorScheme: ColorScheme;
  colors: SemanticColors;
  isDark: boolean;
  setPreference: (preference: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function resolveScheme(
  preference: ThemePreference,
  systemScheme: string | null | undefined,
): ColorScheme {
  if (preference === 'system') {
    return systemScheme === 'dark' ? 'dark' : 'light';
  }
  return preference;
}

function applyNativeTheme(scheme: ColorScheme) {
  nativewindScheme.set(scheme);
  SystemUI.setBackgroundColorAsync(semanticColors[scheme].background);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>('system');

  const colorScheme = resolveScheme(preference, systemScheme);
  const colors = semanticColors[colorScheme];

  useEffect(() => {
    storage.getTheme().then((saved) => {
      if (saved) setPreferenceState(saved);
    });
  }, []);

  useEffect(() => {
    applyNativeTheme(colorScheme);
  }, [colorScheme]);

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next);
    storage.setTheme(next);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      preference,
      colorScheme,
      colors,
      isDark: colorScheme === 'dark',
      setPreference,
    }),
    [preference, colorScheme, colors, setPreference],
  );

  return (
    <ThemeContext.Provider value={value}>
      <View style={themeVars[colorScheme]} className="flex-1 bg-background">
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        {children}
      </View>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
