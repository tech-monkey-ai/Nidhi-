// NIDHI — CategoryTile (industry-grade, 48px icon, 16px padding, 14px radius)

import React from "react";
import { View, StyleSheet } from "react-native";
import {
  Utensils,
  Bus,
  Landmark,
  Home,
  HeartPulse,
  Wallet,
  type LucideIcon,
} from "lucide-react-native";
import type { CategoryDef } from "@/lib/categories";
import { COLORS } from "@/lib/theme";
import { useTheme } from "@/components/useTheme";
import { Pressable } from "@/components/ui/Pressable";
import { Text } from "@/components/ui/Text";

interface CategoryTileProps {
  def: CategoryDef;
  label: string;
  selected: boolean;
  onSelect: () => void;
}

const ICON_MAP: Record<CategoryDef["iconName"], LucideIcon> = {
  Utensils,
  Bus,
  Landmark,
  Home,
  HeartPulse,
  Wallet,
};

export function CategoryTile({ def, label, selected, onSelect }: CategoryTileProps) {
  const { theme, colors } = useTheme();
  const Icon = ICON_MAP[def.iconName];
  const accent = COLORS[theme][def.colorToken];

  return (
    <Pressable
      onPress={onSelect}
      haptic="tap"
      style={[
        styles.tile,
        {
          backgroundColor: selected ? accent : colors.surface,
          borderColor: selected ? accent : colors.border,
          borderWidth: selected ? 2 : 1,
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
      testID={`cat-${def.id}`}
    >
      <View
        style={[
          styles.iconWrap,
          { backgroundColor: selected ? "rgba(255,255,255,0.2)" : colors.surfaceMuted },
        ]}
      >
        <Icon size={28} color={selected ? "#FFFFFF" : accent} />
      </View>
      <Text
        size="bodySmall"
        weight="600"
        align="center"
        style={{ color: selected ? "#FFFFFF" : colors.textPrimary }}
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 14,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
});
