// NIDHI — Premium EmptyState (icon + headline + supportive copy + optional CTA)

import React from "react";
import { View, StyleSheet } from "react-native";
import { LucideIcon } from "lucide-react-native";
import { useTheme } from "@/components/useTheme";
import { H3, Body } from "@/components/ui/Text";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  body: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, body, action }: EmptyStateProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.wrapper}>
      <View style={[styles.iconWrap, { backgroundColor: colors.primarySoft }]}>
        <Icon size={36} color={colors.primary} />
      </View>
      <H3 weight="700" align="center">{title}</H3>
      <Body tone="muted" align="center" style={{ marginTop: 4 }}>{body}</Body>
      {action ? <View style={{ marginTop: 8 }}>{action}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
    paddingHorizontal: 24,
    gap: 0,
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
});
