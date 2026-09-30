// NIDHI — AmountField (industry-grade, 20px font, 14px padding, 14px radius)

import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { useTheme } from "@/components/useTheme";
import { Text, Caption } from "@/components/ui/Text";
import { text } from "@/lib/typography";

interface AmountFieldProps {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  keyboardType?: "numeric" | "number-pad" | "default";
  autoFocus?: boolean;
}

export function AmountField({
  label,
  hint,
  value,
  onChange,
  placeholder,
  keyboardType = "numeric",
  autoFocus,
}: AmountFieldProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.wrapper}>
      <Text size="body" weight="600">{label}</Text>
      {hint ? <Caption tone="muted" style={{ marginTop: 2 }}>{hint}</Caption> : null}
      <View
        style={[
          styles.inputRow,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <Text size="h3" weight="600" tone="muted" style={styles.currency}>₹</Text>
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder ?? "0"}
          placeholderTextColor={colors.textSubtle}
          keyboardType={keyboardType}
          style={[
            styles.input,
            text("numeric", "700"),
            { color: colors.textPrimary },
          ]}
          autoFocus={autoFocus}
          returnKeyType="done"
          maxLength={10}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 6,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    gap: 6,
  },
  currency: {
    fontWeight: "600",
  },
  input: {
    flex: 1,
    fontSize: 20,
    fontVariant: ["tabular-nums"],
    padding: 0,
  },
});
