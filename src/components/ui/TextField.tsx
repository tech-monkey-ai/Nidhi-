// NIDHI — TextField (industry-grade, 16px font, 14px padding, 14px radius)

import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { useTheme } from "@/components/useTheme";
import { Text, Caption } from "@/components/ui/Text";
import { text } from "@/lib/typography";

interface TextFieldProps {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  multiline?: boolean;
  maxLength?: number;
  keyboardType?: "default" | "numeric" | "phone-pad" | "email-address";
  testID?: string;
}

export function TextField({
  label,
  hint,
  value,
  onChange,
  placeholder,
  autoFocus,
  multiline,
  maxLength,
  keyboardType = "default",
  testID,
}: TextFieldProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.wrapper}>
      <Text size="body" weight="600">{label}</Text>
      {hint ? <Caption tone="muted" style={{ marginTop: 2 }}>{hint}</Caption> : null}
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.textSubtle}
        style={[
          styles.input,
          multiline ? styles.inputMultiline : null,
          text("ui", "400"),
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            color: colors.textPrimary,
          },
        ]}
        autoFocus={autoFocus}
        multiline={multiline}
        maxLength={maxLength}
        keyboardType={keyboardType}
        testID={testID}
        returnKeyType="done"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 6,
  },
  input: {
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: "top",
  },
});
