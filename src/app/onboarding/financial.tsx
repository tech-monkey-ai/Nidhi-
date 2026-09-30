// NIDHI — Onboarding: Financial picture (premium polish + validation)

import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Plus, Trash2 } from "lucide-react-native";
import { useTheme } from "@/components/useTheme";
import { useI18n } from "@/lib/i18n";
import { useAppStore } from "@/store/appStore";
import { Header } from "@/components/ui/Header";
import { AmountField } from "@/components/ui/AmountField";
import { TextField } from "@/components/ui/TextField";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ScreenShell } from "@/components/ui/ScreenShell";
import { Text, Caption, Body } from "@/components/ui/Text";
import { BackButton } from "@/components/ui/BackButton";
import { formatCurrency } from "@/lib/format";
import { validateAmount, validateDurationMonths } from "@/lib/validation";
import * as haptics from "@/lib/haptics";

interface EmiDraft {
  amount: string;
  totalAmount: string;
  durationMonths: string;
  description: string;
}

export default function FinancialScreen() {
  const { colors } = useTheme();
  const { t, lang } = useI18n();
  const router = useRouter();
  const setFinancialPicture = useAppStore((s) => s.setFinancialPicture);
  const addEmi = useAppStore((s) => s.addEmi);
  const state = useAppStore();

  const [income, setIncome] = useState(
    state.monthlyIncome ? String(state.monthlyIncome) : "",
  );
  const [goal, setGoal] = useState(
    state.savingsGoal ? String(state.savingsGoal) : "",
  );
  const [emergencyTarget, setEmergencyTarget] = useState(
    state.emergencyFundTarget ? String(state.emergencyFundTarget) : "1000",
  );
  const [emis, setEmis] = useState<EmiDraft[]>([]);
  const [addingEmi, setAddingEmi] = useState(false);
  const [draft, setDraft] = useState<EmiDraft>({
    amount: "",
    totalAmount: "",
    durationMonths: "",
    description: "",
  });

  const addThisEmi = () => {
    const a = validateAmount(draft.amount);
    const tot = validateAmount(draft.totalAmount);
    const dur = validateDurationMonths(draft.durationMonths);
    if (!a.ok || !tot.ok || !dur.ok) return;
    void haptics.success();
    setEmis((prev) => [...prev, draft]);
    setDraft({ amount: "", totalAmount: "", durationMonths: "", description: "" });
    setAddingEmi(false);
  };

  const onNext = () => {
    const inc = validateAmount(income).value ?? 0;
    const g = validateAmount(goal).value ?? 0;
    const em = validateAmount(emergencyTarget).value ?? 1000;
    setFinancialPicture({
      monthlyIncome: inc,
      savingsGoal: g,
      emergencyFundTarget: em,
    });
    for (const d of emis) {
      addEmi({
        amount: validateAmount(d.amount).value ?? 0,
        totalAmount: validateAmount(d.totalAmount).value ?? 0,
        durationMonths: validateDurationMonths(d.durationMonths).value ?? 0,
        elapsedMonths: 0,
        description: d.description.trim(),
        startDate: new Date().toISOString(),
        isActive: true,
      });
    }
    void haptics.success();
    router.push("/onboarding/summary");
  };

  return (
    <ScreenShell>
      <View style={{ marginBottom: 4 }}>
        <BackButton fallbackHref="/onboarding/name" label={t("common.back")} />
      </View>
      <Header title={t("financial.title")} subtitle={t("financial.subtitle")} />

      <AmountField
        label={t("financial.income")}
        hint={t("financial.incomeHint")}
        value={income}
        onChange={setIncome}
        placeholder="0"
      />
      <AmountField
        label={t("financial.savingsGoal")}
        hint={t("financial.savingsGoalHint")}
        value={goal}
        onChange={setGoal}
        placeholder="0"
      />
      <AmountField
        label={t("financial.emergencyTarget")}
        hint={t("financial.emergencyTargetHint")}
        value={emergencyTarget}
        onChange={setEmergencyTarget}
        placeholder="1000"
      />

      <View style={styles.emiBlock}>
        <Text size="bodySmall" weight="600" tone="muted" style={{ textTransform: "uppercase", letterSpacing: 0.6 }}>
          {t("financial.emis")}
        </Text>
        <Caption tone="muted" style={{ marginBottom: 12 }}>{t("financial.emisHint")}</Caption>

        {emis.length > 0 ? (
          <View style={styles.emiList}>
            {emis.map((e, i) => (
              <Card key={i} padding="sm">
                <View style={styles.emiRow}>
                  <View style={styles.emiInfo}>
                    <Body weight="600">{e.description || t("financial.emiDescription")}</Body>
                    <Caption tone="muted" style={{ marginTop: 2 }}>
                      {formatCurrency(Number(e.amount) || 0, lang)} × {e.durationMonths} mo
                    </Caption>
                  </View>
                  <TouchableOpacity
                    onPress={() => setEmis((prev) => prev.filter((_, j) => j !== i))}
                    accessibilityRole="button"
                  >
                    <Trash2 size={20} color={colors.textMuted} />
                  </TouchableOpacity>
                </View>
              </Card>
            ))}
          </View>
        ) : null}

        {addingEmi ? (
          <Card>
            <AmountField
              label={t("financial.emiAmount")}
              value={draft.amount}
              onChange={(v) => setDraft((d) => ({ ...d, amount: v }))}
            />
            <View style={{ height: 12 }} />
            <AmountField
              label={t("financial.emiTotal")}
              value={draft.totalAmount}
              onChange={(v) => setDraft((d) => ({ ...d, totalAmount: v }))}
            />
            <View style={{ height: 12 }} />
            <AmountField
              label={t("financial.emiDuration")}
              value={draft.durationMonths}
              onChange={(v) => setDraft((d) => ({ ...d, durationMonths: v }))}
            />
            <View style={{ height: 12 }} />
            <TextField
              label={t("financial.emiDescription")}
              value={draft.description}
              onChange={(v) => setDraft((d) => ({ ...d, description: v }))}
              placeholder={t("financial.emiDescriptionPlaceholder")}
            />
            <View style={{ height: 16 }} />
            <Button
              label={t("common.save")}
              onPress={addThisEmi}
              size="md"
              disabled={
                !validateAmount(draft.amount).ok ||
                !validateAmount(draft.totalAmount).ok ||
                !validateDurationMonths(draft.durationMonths).ok
              }
            />
          </Card>
        ) : (
          <Button
            label={t("financial.addEmi")}
            onPress={() => setAddingEmi(true)}
            variant="outline"
            icon={<Plus size={18} color={colors.textPrimary} />}
            testID="add-emi"
          />
        )}
      </View>

      <View style={{ marginTop: "auto" }}>
        <Button
          label={t("common.continue")}
          onPress={onNext}
          testID="financial-continue"
        />
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {},
  sectionHint: {
    fontSize: 13,
    marginBottom: 12,
  },
  emiBlock: {
    gap: 6,
  },
  emiList: {
    gap: 8,
  },
  emiRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  emiInfo: {
    flex: 1,
    gap: 2,
  },
});
