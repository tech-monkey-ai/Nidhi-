// NIDHI — Spending insights (descriptive, never prescriptive — premium polish)

import React, { useMemo, useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Info } from "lucide-react-native";
import { useTheme } from "@/components/useTheme";
import { useI18n } from "@/lib/i18n";
import { useAppStore } from "@/store/appStore";
import { Header } from "@/components/ui/Header";
import { Card } from "@/components/ui/Card";
import { ScreenShell } from "@/components/ui/ScreenShell";
import { Text, Body, Caption } from "@/components/ui/Text";
import { CATEGORIES, CATEGORY_ORDER } from "@/lib/categories";
import { formatCurrency, isSameWeek, isSameMonth } from "@/lib/format";
import * as LucideIcons from "lucide-react-native";
import type { CategoryId } from "@/lib/types";
import * as haptics from "@/lib/haptics";

type Period = "week" | "month";

export default function InsightsScreen() {
  const { colors } = useTheme();
  const { t, lang } = useI18n();
  const entries = useAppStore((s) => s.spendingEntries);
  const income = useAppStore((s) => s.monthlyIncome);
  const emis = useAppStore((s) => s.emis);
  const [period, setPeriod] = useState<Period>("week");

  const filtered = useMemo(() => {
    const now = new Date().toISOString();
    return entries.filter((e) =>
      period === "week" ? isSameWeek(e.date, now) : isSameMonth(e.date, now),
    );
  }, [entries, period]);

  const previousFiltered = useMemo(() => {
    const now = new Date();
    const prev = new Date(now);
    if (period === "week") prev.setDate(now.getDate() - 7);
    else prev.setMonth(now.getMonth() - 1);
    const prevIso = prev.toISOString();
    return entries.filter((e) =>
      period === "week" ? isSameWeek(e.date, prevIso) : isSameMonth(e.date, prevIso),
    );
  }, [entries, period]);

  const total = filtered.reduce((sum, e) => sum + e.amount, 0);

  const byCategory = useMemo(() => {
    const map: Record<CategoryId, { current: number; previous: number }> = {
      food: { current: 0, previous: 0 },
      transport: { current: 0, previous: 0 },
      emi_loan: { current: 0, previous: 0 },
      rent: { current: 0, previous: 0 },
      health: { current: 0, previous: 0 },
      other: { current: 0, previous: 0 },
    };
    for (const e of filtered) map[e.category].current += e.amount;
    for (const e of previousFiltered) map[e.category].previous += e.amount;
    return map;
  }, [filtered, previousFiltered]);

  const maxCat = Math.max(1, ...CATEGORY_ORDER.map((c) => byCategory[c].current));

  const observations: string[] = [];

  for (const id of CATEGORY_ORDER) {
    const cur = byCategory[id].current;
    const prev = byCategory[id].previous;
    if (cur === 0 && prev === 0) continue;
    const catName = t(`categories.${id}`);
    if (cur > prev * 1.1 && cur > 0) {
      observations.push(t("insights.obsHighCategory", { category: catName }));
    } else if (cur < prev * 0.9 && prev > 0) {
      observations.push(t("insights.obsLowCategory", { category: catName }));
    }
  }

  const monthlyEmi = emis
    .filter((e) => e.isActive && e.elapsedMonths < e.durationMonths)
    .reduce((s, e) => s + e.amount, 0);
  if (income > 0 && monthlyEmi > 0) {
    const pct = Math.round((monthlyEmi / income) * 100);
    if (pct >= 40) {
      observations.push(t("insights.obsEmiHigh", { percent: pct }));
    } else {
      observations.push(t("insights.obsEmiSafe", { percent: pct }));
    }
  }

  if (observations.length === 0 && filtered.length > 0) {
    observations.push(t("insights.obsSteady"));
  }

  return (
    <ScreenShell>
      <Header title={t("insights.title")} />

      <View style={[styles.tabRow, { backgroundColor: colors.surfaceMuted, borderColor: colors.border }]}>
        {(["week", "month"] as Period[]).map((p) => {
          const active = period === p;
          return (
            <TouchableOpacity
              key={p}
              style={[
                styles.tab,
                {
                  backgroundColor: active ? colors.surface : "transparent",
                  borderColor: active ? colors.border : "transparent",
                },
              ]}
              onPress={() => {
                void haptics.tap();
                setPeriod(p);
              }}
              activeOpacity={0.7}
              accessibilityRole="button"
            >
              <Body weight="600" tone={active ? "primary" : "muted"}
                style={{ color: active ? colors.textPrimary : colors.textMuted }}>
                {p === "week" ? t("insights.weekly") : t("insights.monthly")}
              </Body>
            </TouchableOpacity>
          );
        })}
      </View>

      {filtered.length === 0 ? (
        <Card>
          <Caption tone="muted" align="center" style={{ paddingVertical: 32 }}>
            {t("insights.noEntries")}
          </Caption>
        </Card>
      ) : (
        <>
          {/* Total */}
          <Card elevation="sm">
            <Caption tone="muted">{t("insights.totalSpent")}</Caption>
            <Text size="display" weight="800" numeric style={{ marginTop: 4 }}>
              {formatCurrency(total, lang)}
            </Text>
          </Card>

          {/* By category */}
          <Card elevation="sm">
            <Body weight="700">{t("insights.byCategory")}</Body>
            <View style={styles.catList}>
              {CATEGORY_ORDER.map((id) => {
                const cur = byCategory[id].current;
                const cat = CATEGORIES[id];
                const Icon = (LucideIcons as any)[cat.iconName];
                const pct = maxCat > 0 ? cur / maxCat : 0;
                return (
                  <View key={id} style={styles.catRow}>
                    <View style={styles.catRowLeft}>
                      {Icon ? <Icon size={16} color={colors[cat.colorToken]} /> : null}
                      <Body weight="600">{t(`categories.${id}`)}</Body>
                    </View>
                    <View style={styles.catBarWrap}>
                      <View style={[styles.catBarTrack, { backgroundColor: colors.divider }]}>
                        <View
                          style={[
                            styles.catBarFill,
                            {
                              width: `${Math.max(pct * 100, cur > 0 ? 4 : 0)}%`,
                              backgroundColor: colors[cat.colorToken],
                            },
                          ]}
                        />
                      </View>
                      <Text size="bodySmall" weight="700" numeric style={{ minWidth: 70, textAlign: "right" }}>
                        {formatCurrency(cur, lang)}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </Card>

          {/* Observations */}
          <Card elevation="sm">
            <Body weight="700">{t("insights.observations")}</Body>
            <View style={styles.obsList}>
              {observations.map((o, i) => (
                <View key={i} style={[styles.obsRow, { borderColor: colors.border }]}>
                  <View style={[styles.bullet, { backgroundColor: colors.primarySoft }]}>
                    <View style={[styles.bulletDot, { backgroundColor: colors.primary }]} />
                  </View>
                  <Body style={{ flex: 1, lineHeight: 20 }}>{o}</Body>
                </View>
              ))}
            </View>
          </Card>

          {/* Insurance awareness */}
          <Card elevation="sm">
            <View style={styles.rowLeft}>
              <Info size={16} color={colors.textMuted} />
              <Body weight="700">{t("insights.insuranceAwareness")}</Body>
            </View>
            <Caption tone="muted" style={{ marginTop: 8, lineHeight: 17, fontStyle: "italic" }}>
              {t("insights.disclaimer")}
            </Caption>
          </Card>
        </>
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  tabRow: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    gap: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9,
    borderWidth: 1,
  },
  catList: {
    marginTop: 12,
    gap: 12,
  },
  catRow: {
    gap: 6,
  },
  catRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  catBarWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  catBarTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  catBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  obsList: {
    marginTop: 12,
    gap: 10,
  },
  obsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  bullet: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
