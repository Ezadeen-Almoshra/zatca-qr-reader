import { cssInterop } from 'nativewind';
import React from 'react';
import { StyleSheet, Text as RNText, type TextProps, type TextStyle } from 'react-native';
import { fontForWeight } from '@/shared/theme/fonts';

function AppText({ style, ...props }: TextProps) {
  const flat = StyleSheet.flatten(style) as TextStyle | undefined;
  return (
    <RNText
      {...props}
      style={[style, { fontFamily: fontForWeight(flat?.fontWeight), fontWeight: '400' }]}
    />
  );
}

cssInterop(AppText, { className: 'style' });

export { AppText as Text };
