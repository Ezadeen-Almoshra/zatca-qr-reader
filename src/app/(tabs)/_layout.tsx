import { Tabs } from 'expo-router/js-tabs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { AppIcon, type AppIconName } from '@/shared/components/AppIcon';
import { useTheme } from '@/shared/theme';
import { fonts } from '@/shared/theme/fonts';

function iconColor(color: unknown, fallback: string) {
  return typeof color === 'string' ? color : fallback;
}

const TAB_ICONS = {
  stats: 'pie-chart-outline',
  history: 'time-outline',
  reports: 'document-text-outline',
  about: 'information-circle-outline',
} as const satisfies Record<string, AppIconName>;

export default function TabsLayout() {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.icon,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.line,
          height: 62,
          paddingTop: 4,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: fonts.semibold,
        },
      }}>
      <Tabs.Screen
        name="stats"
        options={{
          title: t('tabs.stats'),
          tabBarIcon: ({ color }) => (
            <AppIcon name={TAB_ICONS.stats} color={iconColor(color, colors.icon)} size={22} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: t('tabs.history'),
          tabBarIcon: ({ color }) => (
            <AppIcon name={TAB_ICONS.history} color={iconColor(color, colors.icon)} size={22} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.scan'),
          tabBarIcon: ({ focused }) => (
            <View
              className="h-12 w-12 items-center justify-center rounded-full"
              style={{
                backgroundColor: focused ? colors.accent : colors.header,
                marginTop: -14,
                borderWidth: 3,
                borderColor: colors.tabBar,
              }}>
              <AppIcon name="scan-outline" size={22} color={colors.inverse} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: t('tabs.reports'),
          tabBarIcon: ({ color }) => (
            <AppIcon name={TAB_ICONS.reports} color={iconColor(color, colors.icon)} size={22} />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: t('tabs.about'),
          tabBarIcon: ({ color }) => (
            <AppIcon name={TAB_ICONS.about} color={iconColor(color, colors.icon)} size={22} />
          ),
        }}
      />
    </Tabs>
  );
}
