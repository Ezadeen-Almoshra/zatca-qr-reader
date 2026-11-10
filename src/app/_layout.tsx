import '@/global.css';

import { Stack } from 'expo-router';
import React from 'react';
import { InvoicesProvider } from '@/features/invoices';
import { DialogProvider } from '@/shared/components/ui/Dialog';
import { I18nProvider } from '@/shared/i18n';
import { ThemeProvider, useTheme } from '@/shared/theme';
import { FontProvider } from '@/shared/theme/FontProvider';

function RootLayoutNav() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="invoice/[id]" />
      <Stack.Screen name="report/[type]" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <FontProvider>
      <ThemeProvider>
        <I18nProvider>
          <DialogProvider>
            <InvoicesProvider>
              <RootLayoutNav />
            </InvoicesProvider>
          </DialogProvider>
        </I18nProvider>
      </ThemeProvider>
    </FontProvider>
  );
}
