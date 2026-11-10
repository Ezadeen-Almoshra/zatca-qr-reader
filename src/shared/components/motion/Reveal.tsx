import { cssInterop } from 'nativewind';
import React from 'react';
import Animated, { FadeInDown } from 'react-native-reanimated';

cssInterop(Animated.View, { className: 'style' });

type RevealProps = {
  delay?: number;
  className?: string;
  children: React.ReactNode;
};

export function Reveal({ delay = 0, className, children }: RevealProps) {
  return (
    <Animated.View
      entering={FadeInDown.duration(520).delay(delay).springify().damping(18).stiffness(160)}
      className={className}>
      {children}
    </Animated.View>
  );
}
