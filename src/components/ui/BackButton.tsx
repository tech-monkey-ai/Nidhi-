// NIDHI — BackButton (mobile-first, large touch target)

import React from "react";
import { TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useTheme } from "@/components/useTheme";
import { Body } from "@/components/ui/Text";
import * as haptics from "@/lib/haptics";

interface BackButtonProps {
  fallbackHref?: string;
  label?: string;
  style?: ViewStyle;
}

export function BackButton({ fallbackHref, label, style }: BackButtonProps) {
  const { colors } = useTheme();
  const router = useRouter();

  const handlePress = () => {
    void haptics.tap();
    if (router.canGoBack()) {
      router.back();
    } else if (fallbackHref) {
      router.replace(fallbackHref);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[styles.container, style]}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={label ?? "Back"}
      hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
    >
      <ChevronLeft size={26} color={colors.textPrimary} />
      {label ? (
        <Body weight="600" style={{ marginLeft: 2 }}>{label}</Body>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
    paddingVertical: 10,
    minHeight: 48,
  },
});
