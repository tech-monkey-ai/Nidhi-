// NIDHI — Header (industry-grade, 22px title, proper spacing)

import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Caption } from "@/components/ui/Text";

interface HeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}

export function Header({ title, subtitle, right }: HeaderProps) {
  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <Text size="h1" weight="700">{title}</Text>
        {subtitle ? <Caption tone="muted" style={{ marginTop: 4 }}>{subtitle}</Caption> : null}
      </View>
      {right ? <View>{right}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  left: {
    flex: 1,
    gap: 4,
  },
});
