// NIDHI — Premium Text component with typography system baked in
//
// Replaces all raw <Text> across the app with one that automatically:
//   - Applies the right font family (Onest Latin / Noto Devanagari / Noto Kannada)
//   - Auto-detects script via Unicode ranges and picks the right font per-glyph
//   - Supports typography scale presets
//   - Auto-applies theme color by default
//   - Provides tabular-num for numeric display
//
// Usage:
//   <Text size="h1" weight="700">Welcome</Text>
//   <Text size="display" weight="800" numeric>₹1,00,000</Text>
//   <Text size="body" tone="muted">Hint text</Text>

import React, { useMemo } from "react";
import { Text as RNText, StyleProp, TextStyle } from "react-native";
import { useTheme } from "@/components/useTheme";
import {
  text,
  TYPE_SCALE,
  type FontWeight,
  type TypeSize,
} from "@/lib/typography";

export type TextTone = "primary" | "muted" | "subtle" | "inverse" | "warning" | "danger" | "info";

export interface TextProps {
  size?: TypeSize;
  weight?: FontWeight;
  tone?: TextTone;
  numeric?: boolean;
  align?: "left" | "center" | "right";
  children?: React.ReactNode;
  style?: StyleProp<TextStyle>;
  maxLines?: number;
  // Pass-through RN Text props:
  numberOfLines?: number;
  allowFontScaling?: boolean;
  adjustsFontSizeToFit?: boolean;
  onPress?: () => void;
  testID?: string;
  accessibilityLabel?: string;
  accessibilityRole?: "button" | "link" | "text" | "header";
}

export function Text({
  size = "body",
  weight = "400",
  tone = "primary",
  numeric = false,
  align,
  children,
  style,
  maxLines,
  ...rest
}: TextProps) {
  const { colors } = useTheme();

  const color = (() => {
    switch (tone) {
      case "primary": return colors.textPrimary;
      case "muted": return colors.textMuted;
      case "subtle": return colors.textSubtle;
      case "inverse": return colors.textInverse;
      case "warning": return colors.warning;
      case "danger": return colors.danger;
      case "info": return colors.info;
      default: return colors.textPrimary;
    }
  })();

  const fontPreset = useMemo(() => {
    return numeric
      ? text("numeric", weight)
      : text("ui", weight);
  }, [numeric, weight]);

  const scale = TYPE_SCALE[size];

  return (
    <RNText
      style={[
        fontPreset,
        {
          fontSize: scale.size,
          lineHeight: scale.lineHeight,
          color,
          textAlign: align,
        },
        style,
      ]}
      numberOfLines={maxLines}
      allowFontScaling={false}
      {...rest}
    >
      {children}
    </RNText>
  );
}

// Convenience exports for the most common patterns — no Omit, just direct props
export function H1(props: TextProps) {
  return <Text size="h1" weight="700" {...props} />;
}
export function H2(props: TextProps) {
  return <Text size="h2" weight="600" {...props} />;
}
export function H3(props: TextProps) {
  return <Text size="h3" weight="600" {...props} />;
}
export function Body(props: TextProps) {
  return <Text size="body" {...props} />;
}
export function Caption(props: TextProps) {
  return <Text size="caption" weight="500" {...props} />;
}
export function Micro(props: TextProps) {
  return <Text size="micro" weight="600" {...props} />;
}
