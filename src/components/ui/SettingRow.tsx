// NIDHI — SettingRow (industry-grade, 16px padding, 14px radius)

import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { useTheme } from "@/components/useTheme";
import { Body, Caption } from "@/components/ui/Text";

interface SettingRowProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  onPress?: () => void;
  testID?: string;
}

export function SettingRow({ title, subtitle, right, onPress, testID }: SettingRowProps) {
  const { colors } = useTheme();
  const Wrapper: typeof TouchableOpacity | typeof View = onPress ? TouchableOpacity : View;
  const wrapperProps = onPress ? { onPress, activeOpacity: 0.7 } : {};
  return (
    <Wrapper
      style={[
        styles.row,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
      testID={testID}
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel={title}
      {...wrapperProps}
    >
      <View style={styles.left}>
        <Body weight="600">{title}</Body>
        {subtitle ? <Caption tone="muted" style={{ marginTop: 3 }}>{subtitle}</Caption> : null}
      </View>
      <View style={styles.right}>
        {right ?? (onPress ? <ChevronRight size={20} color={colors.textMuted} /> : null)}
      </View>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  left: {
    flex: 1,
    gap: 3,
  },
  right: {},
});
