import React from 'react';
import { Image, View } from 'react-native';
import { Text } from '@/shared/components/ui/Text';
import { useTheme } from '@/shared/theme';

interface AvatarProps {
  name: string;
  uri?: string | null;
  size?: number;
  showOnline?: boolean;
}

const AVATAR_COLORS = [
  '#E17076',
  '#FAA61A',
  '#7BC862',
  '#6EC9CB',
  '#65AADD',
  '#A695E7',
  '#EE7AAE',
  '#529364',
];

export function Avatar({ name, uri, size = 50, showOnline }: AvatarProps) {
  const { colors } = useTheme();
  const initials = name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const colorIndex = name.charCodeAt(0) % AVATAR_COLORS.length;
  const dotSize = size * 0.24;

  return (
    <View className="relative">
      {uri ? (
        <Image
          source={{ uri }}
          className="bg-line"
          style={{ width: size, height: size, borderRadius: size / 2 }}
        />
      ) : (
        <View
          className="items-center justify-center"
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: AVATAR_COLORS[colorIndex],
          }}>
          <Text className="font-semibold text-inverse" style={{ fontSize: size * 0.36 }}>
            {initials}
          </Text>
        </View>
      )}
      {showOnline ? (
        <View
          className="absolute bg-online"
          style={{
            width: dotSize,
            height: dotSize,
            borderRadius: dotSize / 2,
            right: size * 0.02,
            bottom: size * 0.02,
            borderWidth: 2,
            borderColor: colors.background,
          }}
        />
      ) : null}
    </View>
  );
}
