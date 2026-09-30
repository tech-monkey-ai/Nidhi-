// NIDHI — Onboarding: Language picker (mobile-first, full-screen hero)

import React from "react";
import { View, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import { Check } from "lucide-react-native";
import { useTheme } from "@/components/useTheme";
import { useI18n } from "@/lib/i18n";
import { useAppStore } from "@/store/appStore";
import type { Language } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Text, H1, Caption } from "@/components/ui/Text";
import * as haptics from "@/lib/haptics";

const LANGS: {
  id: Language;
  nativeLabel: string;
  englishLabel: string;
  greeting: string;
}[] = [
  { id: "en", nativeLabel: "English",  englishLabel: "English", greeting: "Hello" },
  { id: "hi", nativeLabel: "हिन्दी",    englishLabel: "Hindi",   greeting: "नमस्ते" },
  { id: "kn", nativeLabel: "ಕನ್ನಡ",     englishLabel: "Kannada", greeting: "ನಮಸ್ಕಾರ" },
];

export default function LanguageScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { t, setLang } = useI18n();
  const setLanguage = useAppStore((s) => s.setLanguage);
  const selected = useAppStore((s) => s.language);

  const pick = (id: Language) => {
    void haptics.tap();
    setLanguage(id);
    setLang(id);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top half — hero with app name */}
      <View style={[styles.hero, { backgroundColor: colors.primary }]}>
        <Text
          size="display"
          weight="800"
          style={[styles.appName, { color: "#FFFFFF" }]}
        >
          {t("appName")}
        </Text>
        <Text size="body" weight="500" style={{ color: "rgba(255,255,255,0.8)", marginTop: 8 }}>
          {LANGS.find((l) => l.id === selected)?.greeting ?? t("appTagline")}
        </Text>
      </View>

      {/* Bottom half — language list */}
      <View style={styles.body}>
        <H1 weight="700" style={{ marginBottom: 6 }}>{t("language.chooseLanguage")}</H1>
        <Caption tone="muted" style={{ marginBottom: 24 }}>
          {t("language.subtitle")}
        </Caption>

        <View style={styles.list}>
          {LANGS.map((l) => {
            const active = selected === l.id;
            return (
              <TouchableOpacity
                key={l.id}
                style={[
                  styles.row,
                  {
                    backgroundColor: active ? colors.primary : colors.surface,
                    borderColor: active ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => pick(l.id)}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={l.englishLabel}
                testID={`lang-${l.id}`}
              >
                <View style={styles.rowLeft}>
                  <Text
                    size="h2"
                    weight="700"
                    style={{ color: active ? "#FFFFFF" : colors.textPrimary }}
                  >
                    {l.nativeLabel}
                  </Text>
                  <Text
                    size="bodySmall"
                    style={{ color: active ? "rgba(255,255,255,0.7)" : colors.textMuted, marginTop: 2 }}
                  >
                    {l.englishLabel}
                  </Text>
                </View>
                {active ? (
                  <View style={styles.check}>
                    <Check size={20} color={colors.primary} />
                  </View>
                ) : null}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          label={t("common.continue")}
          onPress={() => router.push("/onboarding/welcome")}
          testID="lang-continue"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hero: {
    flex: 0.35,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  appName: {
    color: "#FFFFFF",
  },
  body: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 36,
  },
  list: {
    gap: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 16,
    borderWidth: 1.5,
    minHeight: 76,
  },
  rowLeft: {
    flex: 1,
  },
  check: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
});
