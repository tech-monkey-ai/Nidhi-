// NIDHI — Numpad (industry-grade, large keys, 10px gaps, 14px radius)

import React, { useCallback } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Delete } from "lucide-react-native";
import { useTheme } from "@/components/useTheme";
import { Text } from "@/components/ui/Text";
import * as haptics from "@/lib/haptics";

interface NumpadProps {
  value: string;
  onChange: (next: string) => void;
  maxLength?: number;
  currencySymbol?: string;
}

export function Numpad({
  value,
  onChange,
  maxLength = 9,
  currencySymbol = "₹",
}: NumpadProps) {
  const { colors } = useTheme();

  const press = useCallback((key: string) => {
    void haptics.tap();
    if (key === "del") {
      onChange(value.slice(0, -1));
      return;
    }
    if (value.length >= maxLength) return;
    if (key === "0" && value === "") return;
    onChange(value === "" ? key : value + key);
  }, [value, maxLength, onChange]);

  const keys: Array<{ key: string; label: string; sub?: string } | null> = [
    { key: "1", label: "1" },
    { key: "2", label: "2", sub: "ABC" },
    { key: "3", label: "3", sub: "DEF" },
    { key: "4", label: "4", sub: "GHI" },
    { key: "5", label: "5", sub: "JKL" },
    { key: "6", label: "6", sub: "MNO" },
    { key: "7", label: "7", sub: "PQRS" },
    { key: "8", label: "8", sub: "TUV" },
    { key: "9", label: "9", sub: "WXYZ" },
    null,
    { key: "0", label: "0" },
    { key: "del", label: "del" },
  ];

  return (
    <View style={styles.wrapper}>
      <View style={styles.display}>
        <Text size="h2" weight="600" tone="muted" style={styles.currency}>
          {currencySymbol}
        </Text>
        <Text
          size="display"
          weight="800"
          numeric
          style={styles.displayValue}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {value ? formatNumberIndian(value) : "0"}
        </Text>
      </View>
      <View style={styles.grid}>
        {keys.map((k, i) =>
          k === null ? (
            <View key={`empty-${i}`} style={styles.cell} />
          ) : (
            <TouchableOpacity
              key={k.key}
              style={[
                styles.cell,
                styles.key,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => press(k.key)}
              activeOpacity={0.5}
              accessibilityRole="button"
              accessibilityLabel={k.key === "del" ? "Delete" : k.label}
            >
              {k.key === "del" ? (
                <Delete size={24} color={colors.textPrimary} />
              ) : (
                <View style={styles.keyInner}>
                  <Text size="h2" weight="600" numeric>
                    {k.label}
                  </Text>
                  {k.sub ? (
                    <Text size="micro" weight="500" tone="subtle" style={styles.keySub}>
                      {k.sub}
                    </Text>
                  ) : null}
                </View>
              )}
            </TouchableOpacity>
          ),
        )}
      </View>
    </View>
  );
}

function formatNumberIndian(s: string): string {
  if (!s) return "";
  const [intPart, dec] = s.split(".");
  const hasDecimal = s.includes(".");
  let formatted = intPart;
  if (intPart.length > 3) {
    const last3 = intPart.slice(-3);
    const rest = intPart.slice(0, -3);
    const groups: string[] = [];
    let r = rest;
    while (r.length > 2) {
      groups.unshift(r.slice(-2));
      r = r.slice(0, -2);
    }
    if (r) groups.unshift(r);
    formatted = groups.join(",") + "," + last3;
  }
  return hasDecimal ? `${formatted}.${dec ?? ""}` : formatted;
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 14,
  },
  display: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 16,
  },
  currency: {
    fontWeight: "600",
  },
  displayValue: {
    fontVariant: ["tabular-nums"],
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  cell: {
    width: "31.5%",
    aspectRatio: 1.5,
    borderRadius: 14,
  },
  key: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  keyInner: {
    alignItems: "center",
    justifyContent: "center",
  },
  keySub: {
    marginTop: 2,
    letterSpacing: 1,
  },
});
