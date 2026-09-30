// NIDHI — Premium Skeleton loader (shimmer placeholder)

import React, { useEffect } from "react";
import { View, StyleSheet, DimensionValue, StyleProp, ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useTheme } from "@/components/useTheme";

interface SkeletonProps {
  width?: DimensionValue;
  height?: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
}

export function Skeleton({ width = "100%", height = 16, radius = 8, style }: SkeletonProps) {
  const { colors } = useTheme();
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.9, { duration: 900, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [opacity]);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        styles.base,
        {
          width,
          height,
          borderRadius: radius,
          backgroundColor: colors.surfaceMuted,
        },
        animStyle,
        style,
      ]}
    />
  );
}

export function SkeletonCard() {
  return (
    <View style={styles.card}>
      <Skeleton width="60%" height={14} />
      <View style={{ height: 6 }} />
      <Skeleton width="40%" height={20} />
      <View style={{ height: 12 }} />
      <Skeleton width="100%" height={8} radius={4} />
    </View>
  );
}

const styles = StyleSheet.create({
  base: {},
  card: {
    padding: 16,
    borderRadius: 16,
    gap: 0,
  },
});
