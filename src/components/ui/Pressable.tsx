// NIDHI — Premium Pressable (haptics + scale animation on press)

import React from "react";
import {
  Pressable as RNPressable,
  PressableProps as RNPressableProps,
  ViewStyle,
  StyleProp,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
} from "react-native-reanimated";
import * as haptics from "@/lib/haptics";
import { MOTION } from "@/lib/theme";

const AnimatedPressable = Animated.createAnimatedComponent(RNPressable);

export interface PressableProps extends Omit<RNPressableProps, "style"> {
  children: React.ReactNode;
  scale?: number;
  haptic?: "none" | "tap" | "press" | "success" | "warning";
  style?: StyleProp<ViewStyle>;
}

export function Pressable({
  children,
  scale = 0.97,
  haptic = "tap",
  style,
  onPressIn,
  onPressOut,
  ...rest
}: PressableProps) {
  const pressed = useSharedValue(0);

  const animStyle = useAnimatedStyle(() => {
    const s = interpolate(pressed.value, [0, 1], [1, scale]);
    return {
      transform: [{ scale: withSpring(s, MOTION.springSnappy) }],
    };
  });

  return (
    <AnimatedPressable
      onPressIn={(e) => {
        pressed.value = 1;
        if (haptic !== "none") {
          switch (haptic) {
            case "tap": void haptics.tap(); break;
            case "press": void haptics.press(); break;
            case "success": void haptics.success(); break;
            case "warning": void haptics.warning(); break;
          }
        }
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        pressed.value = 0;
        onPressOut?.(e);
      }}
      style={[style, animStyle as StyleProp<ViewStyle>]}
      {...rest}
    >
      {children}
    </AnimatedPressable>
  );
}
