// NIDHI — Success celebration (animated checkmark drawn with Reanimated + SVG)

import React, { useEffect } from "react";
import { View, StyleSheet, Modal } from "react-native";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  withSpring,
  withDelay,
  Easing,
} from "react-native-reanimated";
import { useTheme } from "@/components/useTheme";
import { Text, H2 } from "@/components/ui/Text";
import { MOTION } from "@/lib/theme";
import * as haptics from "@/lib/haptics";

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface SuccessCelebrationProps {
  visible: boolean;
  title: string;
  body?: string;
  onDone?: () => void;
}

export function SuccessCelebration({
  visible,
  title,
  body,
  onDone,
}: SuccessCelebrationProps) {
  const { colors } = useTheme();
  const checkProgress = useSharedValue(0);
  const scale = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      // Trigger celebration sequence
      void haptics.celebration();
      scale.value = withSpring(1, MOTION.spring);
      checkProgress.value = withDelay(
        200,
        withTiming(1, { duration: 500, easing: Easing.out(Easing.ease) }),
      );
      const t = setTimeout(() => {
        onDone?.();
      }, 1500);
      return () => clearTimeout(t);
    } else {
      checkProgress.value = 0;
      scale.value = 0;
      return undefined;
    }
  }, [visible, checkProgress, scale, onDone]);

  const circleAnim = useAnimatedProps(() => ({
    strokeDasharray: `${283 * scale.value} 283`,
  }));

  const checkAnim = useAnimatedProps(() => ({
    strokeDasharray: `${50 * checkProgress.value} 50`,
  }));

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDone}>
      <View style={[styles.overlay, { backgroundColor: colors.scrim }]}>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <View style={styles.iconWrap}>
            <Svg width={96} height={96} viewBox="0 0 100 100">
              <Defs>
                <LinearGradient id="nidhi-success" x1="0" y1="0" x2="1" y2="1">
                  <Stop offset="0%" stopColor={colors.primary} />
                  <Stop offset="100%" stopColor={colors.primaryDeep} />
                </LinearGradient>
              </Defs>
              <AnimatedPath
                d="M 50 5 A 45 45 0 1 1 49.99 5 Z"
                stroke={`url(#nidhi-success)`}
                strokeWidth={6}
                fill="none"
                strokeLinecap="round"
                animatedProps={circleAnim}
              />
              <AnimatedPath
                d="M 30 50 L 45 65 L 72 38"
                stroke={`url(#nidhi-success)`}
                strokeWidth={8}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                animatedProps={checkAnim}
              />
            </Svg>
          </View>
          <H2 weight="700" align="center" style={{ marginTop: 16 }}>{title}</H2>
          {body ? (
            <Text size="body" tone="muted" align="center" style={{ marginTop: 4 }}>
              {body}
            </Text>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  card: {
    width: "100%",
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderRadius: 24,
    alignItems: "center",
  },
  iconWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
});
