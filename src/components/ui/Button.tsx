// NIDHI — Premium Button (industry-grade mobile, 52-56px height, 14px radius)

import React from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  ViewStyle,
} from "react-native";
import { useTheme } from "@/components/useTheme";
import { TOUCH_TARGET } from "@/lib/theme";
import { type FontWeight } from "@/lib/typography";
import { Pressable } from "@/components/ui/Pressable";
import { Text } from "@/components/ui/Text";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "warning";
type Size = "md" | "lg";

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  style?: ViewStyle;
  testID?: string;
  accessibilityLabel?: string;
  haptic?: "none" | "tap" | "press" | "success" | "warning";
  weight?: FontWeight;
}

export function Button({
  label,
  onPress,
  variant = "primary",
  size = "lg",
  disabled = false,
  loading = false,
  icon,
  iconRight,
  style,
  testID,
  accessibilityLabel,
  haptic,
  weight = "600",
}: ButtonProps) {
  const { colors } = useTheme();

  const bg = (() => {
    switch (variant) {
      case "primary":   return colors.primary;
      case "secondary": return colors.surfaceMuted;
      case "ghost":     return "transparent";
      case "outline":   return "transparent";
      case "warning":   return colors.warning;
    }
  })();

  const fg = (() => {
    switch (variant) {
      case "primary":   return "#FFFFFF";
      case "secondary": return colors.textPrimary;
      case "ghost":     return colors.primary;
      case "outline":   return colors.textPrimary;
      case "warning":   return "#FFFFFF";
    }
  })();

  const height = size === "lg" ? 56 : 48;
  const hapticType: "none" | "tap" | "press" =
    haptic === "none" ? "none"
    : haptic === "press" || ((haptic === undefined) && (variant === "primary" || variant === "warning")) ? "press"
    : "tap";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      haptic={hapticType}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled }}
      testID={testID}
      style={[
        styles.base,
        {
          backgroundColor: bg,
          height,
          borderColor: variant === "outline" ? colors.border : "transparent",
          borderWidth: variant === "outline" ? 1.5 : 0,
          opacity: disabled ? 0.45 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} size="small" />
      ) : (
        <View style={styles.row}>
          {icon ? <View style={{ marginRight: 10 }}>{icon}</View> : null}
          <Text size={size === "lg" ? "h3" : "bodySmall"} weight={weight} style={{ color: fg }}>
            {label}
          </Text>
          {iconRight ? <View style={{ marginLeft: 10 }}>{iconRight}</View> : null}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: TOUCH_TARGET,
    borderRadius: 14,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
