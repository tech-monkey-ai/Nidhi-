// NIDHI — Premium Card (industry-grade, 16px radius, sm elevation default)

import React from "react";
import { View, StyleSheet, ViewProps, StyleProp, ViewStyle } from "react-native";
import { useTheme } from "@/components/useTheme";
import { ELEVATION } from "@/lib/theme";

type CardVariant = "default" | "elevated" | "glass" | "tint";

interface CardProps extends ViewProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  padding?: "sm" | "md" | "lg" | "none";
  variant?: CardVariant;
  elevation?: "none" | "sm" | "md" | "lg";
}

export function Card({
  children,
  style,
  padding = "md",
  variant = "default",
  elevation = "sm",
  ...rest
}: CardProps) {
  const { colors } = useTheme();
  const pad = padding === "sm" ? 14 : padding === "lg" ? 20 : padding === "none" ? 0 : 16;

  const bg = (() => {
    switch (variant) {
      case "elevated": return colors.surfaceElevated;
      case "glass":    return colors.surfaceGlass;
      case "tint":     return colors.surfaceMuted;
      default:         return colors.surface;
    }
  })();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: bg,
          borderColor: variant === "glass" ? "transparent" : colors.border,
          padding: pad,
        },
        elevation !== "none" ? ELEVATION[elevation] : null,
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
  },
});
