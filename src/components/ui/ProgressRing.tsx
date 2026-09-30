// NIDHI — Premium ProgressRing (circular, animated, gradient)

import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withSpring,
} from "react-native-reanimated";
import { useTheme } from "@/components/useTheme";
import { Text } from "@/components/ui/Text";
import { MOTION } from "@/lib/theme";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ProgressRingProps {
  size?: number;
  stroke?: number;
  progress: number; // 0..1
  label?: string;
  sublabel?: string;
  color?: string; // override the primary gradient base
}

export function ProgressRing({
  size = 88,
  stroke = 8,
  progress,
  label,
  sublabel,
  color,
}: ProgressRingProps) {
  const { colors } = useTheme();
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circ = 2 * Math.PI * r;

  const animatedProgress = useSharedValue(0);
  useEffect(() => {
    animatedProgress.value = withSpring(
      Math.max(0, Math.min(1, progress)),
      MOTION.spring,
    );
  }, [progress, animatedProgress]);

  const animatedProps = useAnimatedProps(() => {
    const dash = circ * animatedProgress.value;
    return {
      strokeDasharray: `${dash} ${circ}`,
    };
  });

  const baseColor = color ?? colors.primary;
  const deepColor = color ?? colors.primaryDeep;

  return (
    <View style={styles.wrapper}>
      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient id={`nidhi-ring-grad-${size}`} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor={baseColor} />
            <Stop offset="100%" stopColor={deepColor} />
          </LinearGradient>
        </Defs>
        <Circle
          cx={cx}
          cy={cy}
          r={r}
          stroke={colors.divider}
          strokeWidth={stroke}
          fill="none"
        />
        <AnimatedCircle
          cx={cx}
          cy={cy}
          r={r}
          stroke={`url(#nidhi-ring-grad-${size})`}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          animatedProps={animatedProps}
          rotation={-90}
          origin={`${cx}, ${cy}`}
        />
      </Svg>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={styles.centerStack}>
          {label ? (
            <Text size="h3" weight="700" numeric style={{ marginBottom: 2 }}>
              {label}
            </Text>
          ) : null}
          {sublabel ? (
            <Text size="micro" weight="500" tone="muted">
              {sublabel}
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  centerStack: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
});
