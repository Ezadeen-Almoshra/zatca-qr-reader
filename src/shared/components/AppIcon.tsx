import { Ionicons } from '@expo/vector-icons';
import React from 'react';

export type AppIconName = React.ComponentProps<typeof Ionicons>['name'];

type AppIconProps = {
  name: AppIconName;
  size?: number;
  color: string;
};

export function AppIcon({ name, size = 22, color }: AppIconProps) {
  return <Ionicons name={name} size={size} color={color} />;
}
