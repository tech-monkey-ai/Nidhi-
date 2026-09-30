// NIDHI — Toggle (large switch)

import React from "react";
import { Switch, View } from "react-native";
import { useTheme } from "@/components/useTheme";

interface ToggleProps {
  value: boolean;
  onValueChange: (v: boolean) => void;
}

export function Toggle({ value, onValueChange }: ToggleProps) {
  const { colors } = useTheme();
  return (
    <View pointerEvents="box-none">
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.divider, true: colors.primary }}
        thumbColor="#FFFFFF"
        ios_backgroundColor={colors.divider}
        accessibilityRole="switch"
      />
    </View>
  );
}
