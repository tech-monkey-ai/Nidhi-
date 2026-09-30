// NIDHI — Settings (premium polish, dark mode override added)

import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import {
  Globe,
  Bell,
  Mic,
  Info,
  RotateCcw,
  ChevronRight,
  Landmark,
  Sun,
  Moon,
  Smartphone,
} from "lucide-react-native";
import { useTheme } from "@/components/useTheme";
import { useI18n } from "@/lib/i18n";
import { useAppStore } from "@/store/appStore";
import { Header } from "@/components/ui/Header";
import { Card } from "@/components/ui/Card";
import { SettingRow } from "@/components/ui/SettingRow";
import { Toggle } from "@/components/ui/Toggle";
import { ScreenShell } from "@/components/ui/ScreenShell";
import { Caption, Micro } from "@/components/ui/Text";
import { syncScheduledNotifications } from "@/lib/notifications";
import Constants from "expo-constants";
import type { Language } from "@/lib/types";
import * as haptics from "@/lib/haptics";

export default function SettingsScreen() {
  const { colors } = useTheme();
  const { t, lang, setLang } = useI18n();
  const router = useRouter();
  const state = useAppStore();
  const setNotifications = useAppStore((s) => s.setNotifications);
  const setVoiceEnabled = useAppStore((s) => s.setVoiceEnabled);
  const setDarkModeOverride = useAppStore((s) => s.setDarkModeOverride);
  const resetAll = useAppStore((s) => s.resetAll);

  const [showLangs, setShowLangs] = useState(false);

  const LANGS: { id: Language; label: string }[] = [
    { id: "en", label: "English" },
    { id: "hi", label: "हिन्दी" },
    { id: "kn", label: "ಕನ್ನಡ" },
  ];

  const versionName = Constants.expoConfig?.version ?? "1.0.0";

  const onReset = () => {
    void haptics.warning();
    Alert.alert(
      t("settings.resetConfirmTitle"),
      t("settings.resetConfirmBody"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("settings.resetConfirmCta"),
          style: "destructive",
          onPress: async () => {
            await resetAll();
            router.replace("/onboarding/language");
          },
        },
      ],
    );
  };

  const onLangChange = (l: Language) => {
    void haptics.tap();
    state.setLanguage(l);
    setLang(l);
    void syncScheduledNotifications(useAppStore.getState());
    setShowLangs(false);
  };

  const sectionIcon = (Icon: any) => (
    <View style={[styles.sectionIcon, { backgroundColor: colors.surfaceMuted }]}>
      <Icon size={16} color={colors.textPrimary} />
    </View>
  );

  return (
    <ScreenShell>
      <Header title={t("settings.title")} />

      {/* Language */}
      <View>
        <View style={styles.sectionLabel}>
          {sectionIcon(Globe)}
          <Micro tone="muted" weight="700" style={{ textTransform: "uppercase", letterSpacing: 0.6 }}>
            {t("settings.language")}
          </Micro>
        </View>
        <Card>
          <SettingRow
            title={t("settings.language")}
            subtitle={LANGS.find((l) => l.id === lang)?.label ?? "English"}
            onPress={() => setShowLangs((v) => !v)}
          />
          {showLangs ? (
            <View style={styles.langList}>
              {LANGS.map((l) => (
                <SettingRow
                  key={l.id}
                  title={l.label}
                  right={
                    <View
                      style={[
                        styles.radio,
                        {
                          borderColor: lang === l.id ? colors.primary : colors.border,
                          backgroundColor: lang === l.id ? colors.primary : "transparent",
                        },
                      ]}
                    />
                  }
                  onPress={() => onLangChange(l.id)}
                />
              ))}
            </View>
          ) : null}
        </Card>
      </View>

      {/* Appearance */}
      <View>
        <View style={styles.sectionLabel}>
          {sectionIcon(Smartphone)}
          <Micro tone="muted" weight="700" style={{ textTransform: "uppercase", letterSpacing: 0.6 }}>
            Appearance
          </Micro>
        </View>
        <Card>
          <View style={styles.stack}>
            {([
              { id: "auto", label: "System", icon: Smartphone },
              { id: "light", label: "Light", icon: Sun },
              { id: "dark", label: "Dark", icon: Moon },
            ] as const).map((opt) => {
              const active = state.darkModeOverride === opt.id;
              return (
                <SettingRow
                  key={opt.id}
                  title={opt.label}
                  right={
                    <View
                      style={[
                        styles.radio,
                        {
                          borderColor: active ? colors.primary : colors.border,
                          backgroundColor: active ? colors.primary : "transparent",
                        },
                      ]}
                    />
                  }
                  onPress={() => {
                    void haptics.tap();
                    setDarkModeOverride(opt.id);
                  }}
                />
              );
            })}
          </View>
        </Card>
      </View>

      {/* Notifications */}
      <View>
        <View style={styles.sectionLabel}>
          {sectionIcon(Bell)}
          <Micro tone="muted" weight="700" style={{ textTransform: "uppercase", letterSpacing: 0.6 }}>
            {t("settings.notifications")}
          </Micro>
        </View>
        <Card>
          <View style={styles.stack}>
            <SettingRow
              title={t("settings.notif.dailyLog")}
              right={
                <Toggle
                  value={state.notifications.dailyLogReminder}
                  onValueChange={(v) => {
                    void haptics.tap();
                    setNotifications({ dailyLogReminder: v });
                    void syncScheduledNotifications(useAppStore.getState());
                  }}
                />
              }
            />
            <SettingRow
              title={t("settings.notif.largeExpense")}
              right={
                <Toggle
                  value={state.notifications.largeExpenseAlert}
                  onValueChange={(v) => setNotifications({ largeExpenseAlert: v })}
                />
              }
            />
            <SettingRow
              title={t("settings.notif.emiDue")}
              right={
                <Toggle
                  value={state.notifications.emiDueReminder}
                  onValueChange={(v) => {
                    void haptics.tap();
                    setNotifications({ emiDueReminder: v });
                    void syncScheduledNotifications(useAppStore.getState());
                  }}
                />
              }
            />
            <SettingRow
              title={t("settings.notif.savingsNudge")}
              right={
                <Toggle
                  value={state.notifications.savingsNudge}
                  onValueChange={(v) => {
                    void haptics.tap();
                    setNotifications({ savingsNudge: v });
                    void syncScheduledNotifications(useAppStore.getState());
                  }}
                />
              }
            />
            <SettingRow
              title={t("settings.notif.emergencyMilestone")}
              right={
                <Toggle
                  value={state.notifications.emergencyFundMilestone}
                  onValueChange={(v) => setNotifications({ emergencyFundMilestone: v })}
                />
              }
            />
          </View>
        </Card>
      </View>

      {/* Voice */}
      <View>
        <View style={styles.sectionLabel}>
          {sectionIcon(Mic)}
          <Micro tone="muted" weight="700" style={{ textTransform: "uppercase", letterSpacing: 0.6 }}>
            {t("settings.voice")}
          </Micro>
        </View>
        <Card>
          <SettingRow
            title={t("settings.voiceEnabled")}
            subtitle={t("settings.voiceHint")}
            right={
              <Toggle
                value={state.voiceEnabled}
                onValueChange={(v) => {
                  void haptics.tap();
                  setVoiceEnabled(v);
                }}
              />
            }
          />
        </Card>
      </View>

      {/* EMI management */}
      <View>
        <View style={styles.sectionLabel}>
          {sectionIcon(Landmark)}
          <Micro tone="muted" weight="700" style={{ textTransform: "uppercase", letterSpacing: 0.6 }}>
            {t("settings.emiManagement")}
          </Micro>
        </View>
        <Card>
          {state.emis.length === 0 ? (
            <SettingRow
              title={t("financial.emis")}
              subtitle={t("dashboard.emiExposureDescSafe")}
              onPress={() => router.push("/onboarding/financial")}
              right={<ChevronRight size={20} color={colors.textMuted} />}
            />
          ) : (
            <View style={styles.stack}>
              {state.emis.map((e) => (
                <SettingRow
                  key={e.id}
                  title={e.description || t("financial.emiDescription")}
                  subtitle={`₹${e.amount.toLocaleString("en-IN")} × ${e.durationMonths} mo`}
                  right={<ChevronRight size={20} color={colors.textMuted} />}
                  onPress={() => router.push("/onboarding/financial")}
                />
              ))}
            </View>
          )}
        </Card>
      </View>

      {/* About */}
      <View>
        <View style={styles.sectionLabel}>
          {sectionIcon(Info)}
          <Micro tone="muted" weight="700" style={{ textTransform: "uppercase", letterSpacing: 0.6 }}>
            {t("settings.about")}
          </Micro>
        </View>
        <Card>
          <SettingRow
            title={t("settings.about")}
            subtitle={t("settings.aboutBody")}
          />
          <View style={{ height: 8 }} />
          <SettingRow
            title={t("settings.version")}
            right={
              <Caption tone="muted" numeric>{versionName}</Caption>
            }
          />
        </Card>
      </View>

      {/* Reset */}
      <View>
        <View style={styles.sectionLabel}>
          {sectionIcon(RotateCcw)}
          <Micro tone="muted" weight="700" style={{ textTransform: "uppercase", letterSpacing: 0.6 }}>
            {t("settings.resetApp")}
          </Micro>
        </View>
        <Card>
          <SettingRow
            title={t("settings.resetApp")}
            subtitle={t("settings.resetConfirmBody")}
            onPress={onReset}
            right={
              <View style={[styles.resetBadge, { backgroundColor: colors.warningSoft }]}>
                <RotateCcw size={16} color={colors.warning} />
              </View>
            }
          />
        </Card>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  sectionLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 4,
    marginBottom: 6,
  },
  sectionIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  stack: {
    gap: 4,
  },
  langList: {
    marginTop: 8,
    gap: 4,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
  },
  resetBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});
