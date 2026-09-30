// NIDHI — Global ErrorBoundary
//
// Wraps the entire app so no uncaught error ever reaches a white screen.
// On error: shows a warm, dignified recovery screen with a "Restart" CTA
// that resets the React tree (without wiping user data).
//
// IMPORTANT: This component deliberately uses raw <Text> and inline styles
// instead of the premium Text/Typography components. That way, even if the
// crash was caused by a font loading failure or a Typography import error,
// the ErrorBoundary itself can still render and show the recovery screen.

import React, { Component, type ErrorInfo, type ReactNode } from "react";
import { View, Text as RNText, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { RefreshCw, AlertTriangle } from "lucide-react-native";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

const COLORS = {
  bg: "#FAF9F6",
  surface: "#FFFFFF",
  surfaceMuted: "#F4F2EC",
  border: "#E7E3DA",
  textPrimary: "#1F2937",
  textMuted: "#6B7280",
  warning: "#D97706",
  warningSoft: "#FEF3C7",
  primary: "#0F9D58",
};

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (!this.state.hasError) return this.props.children;
    return <ErrorFallback error={this.state.error} onReset={this.handleReset} />;
  }
}

function ErrorFallback({ error, onReset }: { error: Error | null; onReset: () => void }) {
  return (
    <View style={[styles.container, { backgroundColor: COLORS.bg }]}>
      <ScrollView contentContainerStyle={styles.scroll} bounces={false}>
        <View style={[styles.iconWrap, { backgroundColor: COLORS.warningSoft }]}>
          <AlertTriangle size={40} color={COLORS.warning} />
        </View>
        <RNText style={styles.title}>
          Something went wrong
        </RNText>
        <RNText style={styles.body}>
          Nidhi hit an unexpected error. Your data is safe — just tap restart to continue.
        </RNText>
        {error ? (
          <View style={[styles.errorBox, { backgroundColor: COLORS.surfaceMuted, borderColor: COLORS.border }]}>
            <RNText style={styles.errorText}>
              {error.message}
            </RNText>
          </View>
        ) : null}
        <View style={styles.ctaRow}>
          <TouchableOpacity
            onPress={onReset}
            style={styles.ctaButton}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Restart app"
          >
            <RefreshCw size={20} color="#FFFFFF" />
            <RNText style={styles.ctaText}>Restart app</RNText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginTop: 16,
    textAlign: "center",
  },
  body: {
    fontSize: 16,
    color: COLORS.textMuted,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 22,
  },
  errorBox: {
    marginTop: 24,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    width: "100%",
  },
  errorText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontStyle: "italic",
  },
  ctaRow: {
    marginTop: 24,
    width: "100%",
  },
  ctaButton: {
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  ctaText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
  },
});
