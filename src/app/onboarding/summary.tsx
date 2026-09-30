// NIDHI — Onboarding: Summary + finish (premium celebration)

import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Pencil } from "lucide-react-native";
import { useTheme } from "@/components/useTheme";
import { useI18n } from "@/lib/i18n";
import { useAppStore } from "@/store/appStore";
import { Header } from "@/components/ui/Header";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ScreenShell } from "@/components/ui/ScreenShell";
import { Text, Caption, Body } from "@/components/ui/Text";
import { BackButton } from "@/components/ui/BackButton";
import { formatCurrency } from "@/lib/format";
import { SuccessCelebration } from "@/components/ui/SuccessCelebration";
import * as haptics from "@/lib/haptics";

export default function SummaryScreen() {
  const { colors } = useTheme();
  const { t, lang } = useI18n();
  const router = useRouter();
  const state = useAppStore();
  const setOnboarded = useAppStore((s) => s.setOnboarded);
  const [celebrating, setCelebrating] = React.useState(false);

  const fields: {
    label: string;
    value: string;
    onEdit: () => void;
  }[] = [
    {
      label: t("name.placeholder"),
      value: state.userName || "—",
      onEdit: () => router.push("/onboarding/name"),
    },
    {
      label: t("financial.income"),
      value: formatCurrency(state.monthlyIncome, lang),
      onEdit: () => router.push("/onboarding/financial"),
    },
    {
      label: t("financial.savingsGoal"),
      value: formatCurrency(state.savingsGoal, lang),
      onEdit: () => router.push("/onboarding/financial"),
    },
    {
      label: t("financial.emergencyTarget"),
      value: formatCurrency(state.emergencyFundTarget, lang),
      onEdit: () => router.push("/onboarding/financial"),
    },
  ];

  if (state.emis.length > 0) {
    fields.push({
      label: t("financial.emis"),
      value: `${state.emis.length} ${state.emis.length === 1 ? "EMI" : "EMIs"}`,
      onEdit: () => router.push("/onboarding/financial"),
    });
  }

  const finish = () => {
    void haptics.celebration();
    setCelebrating(true);
  };

  const onCelebrationDone = () => {
    setCelebrating(false);
    setOnboarded(true);
    router.replace("/(app)/dashboard");
  };

  return (
    <ScreenShell>
      <View style={{ marginBottom: 4 }}>
        <BackButton fallbackHref="/onboarding/financial" label={t("common.back")} />
      </View>
      <Header title={t("summary.title")} subtitle={t("summary.subtitle")} />
      <View style={styles.list}>
        {fields.map((f, i) => (
          <Card key={i}>
            <View style={styles.row}>
              <View style={styles.info}>
                <Caption tone="muted">{f.label}</Caption>
                <Text size="h3" weight="700" numeric style={{ marginTop: 2 }}>
                  {f.value}
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.editBtn,
                  { borderColor: colors.border, backgroundColor: colors.surfaceMuted },
                ]}
                onPress={f.onEdit}
                accessibilityRole="button"
                accessibilityLabel={`${t("common.edit")} ${f.label}`}
              >
                <Pencil size={16} color={colors.textPrimary} />
                <Body weight="600" style={{ marginLeft: 6 }}>{t("common.edit")}</Body>
              </TouchableOpacity>
            </View>
          </Card>
        ))}
      </View>
      <View style={{ marginTop: "auto" }}>
        <Button
          label={t("summary.finish")}
          onPress={finish}
          testID="summary-finish"
        />
      </View>

      <SuccessCelebration
        visible={celebrating}
        title={t("summary.welcomeAboard", { name: state.userName || "" })}
        body={t("appTagline")}
        onDone={onCelebrationDone}
      />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
});
