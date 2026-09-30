// NIDHI — ScreenShell (industry-grade mobile layout, proper safe areas)

import React from "react";
import { View, StyleSheet, ScrollView, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/components/useTheme";

interface ScreenShellProps {
  children: React.ReactNode;
  scroll?: boolean;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  padded?: boolean;
}

export function ScreenShell({
  children,
  scroll = true,
  style,
  contentContainerStyle,
  padded = true,
}: ScreenShellProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const containerStyle: ViewStyle = {
    backgroundColor: colors.background,
    flex: 1,
    paddingTop: insets.top + 8,
    paddingBottom: insets.bottom + 8,
  };

  const inner = (
    <View style={[padded ? styles.padded : null, contentContainerStyle]}>
      {children}
    </View>
  );

  if (scroll) {
    return (
      <ScrollView
        style={[containerStyle, style]}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        alwaysBounceVertical={false}
      >
        {inner}
      </ScrollView>
    );
  }

  return <View style={[containerStyle, style]}>{inner}</View>;
}

const styles = StyleSheet.create({
  padded: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 16,
  },
});
