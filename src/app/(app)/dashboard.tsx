// NIDHI — Dashboard (10x UI, mobile-first, proper spacing)

import React, { useMemo } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import {
  ArrowRight,
  PiggyBank,
  Shield,
  Landmark,
  PlusCircle,
} from "lucide-react-native";
import { useTheme } from "@/components/useTheme";
import { useI18n } from "@/lib/i18n";
import {
  useAppStore,
  useTotalSpentThisMonth,
  useTotalLockedSavings,
  useTotalEmergencySavings,
  useMonthlyEmiTotal,
  useSavingsThisMonth,
} from "@/store/appStore";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";
import { BannerAd } from "@/components/ui/BannerAd";
import { ScreenShell } from "@/components/ui/ScreenShell";
import { Text, H1, Body, Caption, Micro } from "@/components/ui/Text";
import {
  formatCurrency,
  greetingKey,
  formatDate,
} from "@/lib/format";
import { CATEGORIES } from "@/lib/categories";
import * as LucideIcons from "lucide-react-native";

export default function DashboardScreen() {
  const { colors } = useTheme();
  const { t, lang } = useI18n();
  const router = useRouter();
  const state = useAppStore();

  const totalSpent = useTotalSpentThisMonth();
  const lockedSavings = useTotalLockedSavings();
  const emergencySavings = useTotalEmergencySavings();
  const emiTotal = useMonthlyEmiTotal();
  const savedThisMonthLocked = useSavingsThisMonth("locked");

  const income = state.monthlyIncome || 0;
  const moneyKept = Math.max(0, income - totalSpent);
  const savingsProgress =
    state.savingsGoal > 0 ? Math.min(1, savedThisMonthLocked / state.savingsGoal) : 0;
  const emergencyProgress =
    state.emergencyFundTarget > 0
      ? Math.min(1, emergencySavings / state.emergencyFundTarget)
      : 0;
  const emiExposure = income > 0 ? (emiTotal / income) * 100 : 0;

  const recent = useMemo(() => state.spendingEntries.slice(0, 3), [state.spendingEntries]);

  return (
    <ScreenShell>
      {/* Greeting */}
      <View style={styles.greetRow}>
        <View>
          <Caption tone="muted" weight="500">
            {t(`greeting.${greetingKey()}`)},
          </Caption>
          <H1 weight="700" style={{ marginTop: 2 }}>{state.userName || "—"}</H1>
        </View>
      </View>

      {/* Hero card */}
      <Card padding="lg" elevation="md" style={[styles.heroCard, { backgroundColor: colors.primary, borderWidth: 0 }]}>
        <Micro weight="700" style={{ color: "rgba(255,255,255,0.8)" }}>
          {t("dashboard.moneyKept").toUpperCase()}
        </Micro>
        <Text size="display" weight="800" numeric style={{ marginTop: 6, color: "#FFFFFF" }}>
          {formatCurrency(moneyKept, lang)}
        </Text>
        <View style={styles.heroRow}>
          <View style={[styles.heroChip, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
            <PiggyBank size={13} color="#FFFFFF" />
            <Caption weight="600" style={{ color: "#FFFFFF" }}>
              {t("dashboard.lockedSavings")}: {formatCurrency(lockedSavings, lang)}
            </Caption>
          </View>
        </View>
      </Card>

      {/* Savings goal */}
      <Card elevation="sm">
        <View style={styles.rowBetween}>
          <View style={styles.rowLeft}>
            <View style={[styles.iconWrap, { backgroundColor: colors.primarySoft }]}>
              <PiggyBank size={18} color={colors.primary} />
            </View>
            <View style={styles.cardInfo}>
              <Body weight="600">{t("dashboard.savingsGoalProgress")}</Body>
              <View style={styles.progressTextRow}>
                <Text size="bodySmall" weight="600" numeric style={{ color: colors.textPrimary }}>
                  {formatCurrency(savedThisMonthLocked, lang)}
                </Text>
                <Text size="bodySmall" tone="muted" numeric>
                  {" / "}{formatCurrency(state.savingsGoal, lang)}
                </Text>
              </View>
            </View>
          </View>
          <Text size="h2" weight="700" numeric tone="primary">
            {Math.round(savingsProgress * 100)}%
          </Text>
        </View>
        <View style={{ marginTop: 14 }}>
          <ProgressBar progress={savingsProgress} />
        </View>
      </Card>

      {/* Emergency fund */}
      <Card elevation="sm">
        <View style={styles.rowBetween}>
          <View style={styles.rowLeft}>
            <View style={[styles.iconWrap, { backgroundColor: colors.warningSoft }]}>
              <Shield size={18} color={colors.warning} />
            </View>
            <View style={styles.cardInfo}>
              <Body weight="600">{t("dashboard.emergencyFundProgress")}</Body>
              <View style={styles.progressTextRow}>
                <Text size="bodySmall" weight="600" numeric style={{ color: colors.textPrimary }}>
                  {formatCurrency(emergencySavings, lang)}
                </Text>
                <Text size="bodySmall" tone="muted" numeric>
                  {" / "}{formatCurrency(state.emergencyFundTarget, lang)}
                </Text>
              </View>
            </View>
          </View>
          <Text size="h2" weight="700" numeric style={{ color: colors.warning }}>
            {Math.round(emergencyProgress * 100)}%
          </Text>
        </View>
        <View style={{ marginTop: 14 }}>
          <ProgressBar progress={emergencyProgress} color={colors.warning} />
        </View>
      </Card>

      {/* EMI exposure */}
      <Card elevation="sm">
        <View style={styles.rowBetween}>
          <View style={styles.rowLeft}>
            <View style={[styles.iconWrap, { backgroundColor: "rgba(124, 58, 237, 0.10)" }]}>
              <Landmark size={18} color={colors.catEmi} />
            </View>
            <View style={styles.cardInfo}>
              <Body weight="600">{t("dashboard.emiExposure")}</Body>
              <Caption tone="muted" style={{ marginTop: 2 }}>
                {emiTotal > 0 && income > 0
                  ? t("dashboard.emiExposureDesc", { percent: Math.round(emiExposure) })
                  : t("dashboard.emiExposureDescSafe")}
              </Caption>
            </View>
          </View>
        </View>
      </Card>

      {/* Banner ad */}
      <BannerAd />

      {/* CTA */}
      <Button
        label={t("dashboard.logTodaySpending")}
        onPress={() => router.push("/(app)/log")}
        icon={<PlusCircle size={22} color="#FFFFFF" />}
        testID="log-today-spending"
      />

      {/* Recent entries */}
      {recent.length > 0 ? (
        <View style={styles.recentBlock}>
          <View style={styles.rowBetween}>
            <Body weight="700">{t("dashboard.recentEntries")}</Body>
            <TouchableOpacity
              onPress={() => router.push("/(app)/insights")}
              accessibilityRole="button"
            >
              <View style={[styles.rowLeft, { gap: 4 }]}>
                <Caption weight="600" tone="primary">{t("dashboard.viewAll")}</Caption>
                <ArrowRight size={14} color={colors.primary} />
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.entryList}>
            {recent.map((e) => {
              const cat = CATEGORIES[e.category];
              const Icon = (LucideIcons as any)[cat.iconName];
              return (
                <Card key={e.id} padding="sm" elevation="none" variant="tint">
                  <View style={styles.rowBetween}>
                    <View style={styles.rowLeft}>
                      <View
                        style={[
                          styles.iconWrap,
                          { backgroundColor: colors[cat.colorToken] + "22" },
                        ]}
                      >
                        {Icon ? <Icon size={16} color={colors[cat.colorToken]} /> : null}
                      </View>
                      <View>
                        <Body weight="600">{t(`categories.${e.category}`)}</Body>
                        <Caption tone="muted" style={{ marginTop: 1 }}>
                          {formatDate(e.date, lang)}
                        </Caption>
                      </View>
                    </View>
                    <Text size="h3" weight="700" numeric>
                      {formatCurrency(e.amount, lang)}
                    </Text>
                  </View>
                </Card>
              );
            })}
          </View>
        </View>
      ) : (
        <Card>
          <Body tone="muted" align="center" style={{ paddingVertical: 16 }}>
            {t("dashboard.noEntriesYet")}
          </Body>
        </Card>
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  greetRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heroCard: {},
  heroRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 14,
    flexWrap: "wrap",
  },
  heroChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  cardInfo: {
    flex: 1,
    gap: 3,
  },
  progressTextRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 2,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  recentBlock: {
    gap: 10,
  },
  entryList: {
    gap: 8,
  },
});
