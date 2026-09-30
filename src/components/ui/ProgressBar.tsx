// NIDHI — Premium ProgressBar (animated linear fill)

import React, { useEffect } from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { useTheme } from "@/components/useTheme";
import { MOTION } from "@/lib/theme";

interface ProgressBarProps {
  progress: number; // 0..1
  height?: number;
  style?: ViewStyle;
  color?: string;
  trackColor?: string;
}

export function ProgressBar({
  progress,
  height = 8,
  style,
  color,
  trackColor,
}: ProgressBarProps) {
  const { colors } = useTheme();
  const clamped = Math.max(0, Math.min(1, progress));

  const width = useSharedValue(0);
  useEffect(() => {
    width.value = withSpring(clamped, MOTION.spring);
  }, [clamped, width]);

  const animStyle = useAnimatedStyle(() => ({
    width: `${Math.max(width.value * 100, clamped > 0 ? 4 : 0)}%`,
  }));

  return (
    <View
      style={[
        styles.track,
        {
          height,
          backgroundColor: trackColor ?? colors.divider,
          borderRadius: height / 2,
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.fill,
          {
            backgroundColor: color ?? colors.primary,
            borderRadius: height / 2,
          },
          animStyle,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    overflow: "hidden",
    width: "100%",
  },
  fill: {
    height: "100%",
  },
});
