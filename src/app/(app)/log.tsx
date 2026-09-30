// NIDHI — Log spending flow (final — icon categories, fixed numpad, voice transcript)

import React, { useState } from "react";
import { View, StyleSheet, Alert, Modal, TouchableOpacity, SafeAreaView, TextInput, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { X, Check, Delete } from "lucide-react-native";
import { useTheme } from "@/components/useTheme";
import { useI18n } from "@/lib/i18n";
import { useAppStore, useCategoryRollingAverage } from "@/store/appStore";
import { CATEGORY_ORDER, CATEGORIES } from "@/lib/categories";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MicButton } from "@/components/ui/MicButton";
import { ScreenShell } from "@/components/ui/ScreenShell";
import { Header } from "@/components/ui/Header";
import { BackButton } from "@/components/ui/BackButton";
import { SuccessCelebration } from "@/components/ui/SuccessCelebration";
import { showInterstitialAfterLog } from "@/lib/revenuecat";
import { formatCurrency } from "@/lib/format";
import { validateAmount } from "@/lib/validation";
import type { CategoryId } from "@/lib/types";
import * as haptics from "@/lib/haptics";
import {
  Utensils, Bus, Landmark, Home, HeartPulse, Wallet,
  type LucideIcon,
} from "lucide-react-native";
import { Text, Body, Caption, Micro } from "@/components/ui/Text";
import { text as fontText } from "@/lib/typography";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const NUMPAD_GAP = 12;
const NUMPAD_COLS = 3;
const NUMPAD_CELL_SIZE = (SCREEN_WIDTH - 40 * 2 - NUMPAD_GAP * (NUMPAD_COLS - 1)) / NUMPAD_COLS;

const ICON_MAP: Record<string, LucideIcon> = {
  Utensils, Bus, Landmark, Home, HeartPulse, Wallet,
};

// Fixed-size numpad — uses explicit pixel widths, not flex percentages
function SheetNumpad({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const { colors } = useTheme();
  const press = (key: string) => {
    void haptics.tap();
    if (key === "del") {
      onChange(value.slice(0, -1));
      return;
    }
    if (value.length >= 9) return;
    if (key === "0" && value === "") return;
    onChange(value === "" ? key : value + key);
  };

  const rows = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["del", "0", ""],
  ];

  return (
    <View style={numpadStyles.container}>
      {rows.map((row, rowIdx) => (
        <View key={`row-${rowIdx}`} style={numpadStyles.row}>
          {row.map((key) => {
            if (key === "") return <View key="empty" style={[numpadStyles.cell, { width: NUMPAD_CELL_SIZE }]} />;
            const isDel = key === "del";
            return (
              <TouchableOpacity
                key={key}
                style={[
                  numpadStyles.cell,
                  numpadStyles.key,
                  {
                    width: NUMPAD_CELL_SIZE,
                    backgroundColor: colors.surfaceMuted,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => press(key)}
                activeOpacity={0.5}
                accessibilityRole="button"
              >
                {isDel ? (
                  <Delete size={22} color={colors.textPrimary} />
                ) : (
                  <Text size="h2" weight="700" numeric>{key}</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const numpadStyles = StyleSheet.create({
  container: {
    gap: NUMPAD_GAP,
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    gap: NUMPAD_GAP,
  },
  cell: {
    height: NUMPAD_CELL_SIZE * 0.85,
    borderRadius: 14,
  },
  key: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
});

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
    while (r.length > 2) { groups.unshift(r.slice(-2)); r = r.slice(0, -2); }
    if (r) groups.unshift(r);
    formatted = groups.join(",") + "," + last3;
  }
  return hasDecimal ? `${formatted}.${dec ?? ""}` : formatted;
}

export default function LogScreen() {
  const { colors } = useTheme();
  const { t, lang } = useI18n();
  const router = useRouter();
  const addSpending = useAppStore((s) => s.addSpending);
  const [category, setCategory] = useState<CategoryId | null>(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [celebrating, setCelebrating] = useState(false);
  const [showNumpad, setShowNumpad] = useState(false);

  const rollAvg = useCategoryRollingAverage(category ?? "food", 30);
  const numericAmount = validateAmount(amount).value ?? 0;
  const isLargeExpense = rollAvg > 0 && numericAmount > rollAvg * 1.5;

  const onSave = () => {
    if (!category || numericAmount <= 0) return;
    addSpending({
      date: new Date().toISOString(),
      category,
      amount: numericAmount,
      note: note.trim() || undefined,
    });
    void haptics.success();
    setCelebrating(true);
  };

  const onCelebrationDone = () => {
    setCelebrating(false);
    void showInterstitialAfterLog();
    router.replace("/(app)/dashboard");
  };

  return (
    <ScreenShell>
      <View style={{ marginBottom: 4 }}>
        <BackButton fallbackHref="/(app)/dashboard" label={t("common.cancel")} />
      </View>
      <Header title={t("log.title")} />

      {/* Category grid — icon only */}
      <View>
        <Micro tone="muted" weight="700" style={{ marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.6 }}>
          {t("log.pickCategory")}
        </Micro>
        <View style={styles.catGrid}>
          {CATEGORY_ORDER.map((id) => {
            const cat = CATEGORIES[id];
            const Icon = ICON_MAP[cat.iconName];
            const accent = colors[cat.colorToken];
            const isSel = category === id;
            return (
              <TouchableOpacity
                key={id}
                style={[
                  styles.catTile,
                  {
                    backgroundColor: isSel ? accent : colors.surface,
                    borderColor: isSel ? accent : colors.border,
                    borderWidth: isSel ? 2 : 1,
                  },
                ]}
                onPress={() => {
                  void haptics.tap();
                  setCategory(id);
                  setShowNumpad(true);
                }}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={t(`categories.${id}`)}
                testID={`cat-${id}`}
              >
                {Icon ? <Icon size={28} color={isSel ? "#FFFFFF" : accent} /> : null}
                {isSel ? (
                  <View style={styles.catCheck}>
                    <Check size={12} color={accent} />
                  </View>
                ) : null}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Selected category summary */}
      {category && numericAmount > 0 && (
        <View style={styles.selectedBlock}>
          <Card padding="md" elevation="sm">
            <View style={styles.rowBetween}>
              <Body weight="600">{t(`categories.${category}`)}</Body>
              <Text size="h2" weight="700" numeric>{formatCurrency(numericAmount, lang)}</Text>
            </View>
            {isLargeExpense ? (
              <Caption weight="600" style={{ marginTop: 8, color: colors.warning }}>
                {t("log.aboveTypical", { amount: formatCurrency(rollAvg, lang) })}
              </Caption>
            ) : null}
          </Card>

          {/* Voice note section */}
          <View style={styles.voiceSection}>
            <Micro tone="muted" weight="700" style={{ marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.6 }}>
              {t("log.addNote")} · {t("common.optional")}
            </Micro>
            <MicButton onTranscript={(text) => setNote((prev) => prev + (prev ? " " : "") + text)} />
            <View style={[styles.transcriptField, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <TextInput
                value={note}
                onChangeText={setNote}
                placeholder={t("log.recordNote")}
                placeholderTextColor={colors.textSubtle}
                style={[styles.transcriptInput, fontText("ui", "400"), { color: colors.textPrimary }]}
                multiline
                maxLength={500}
              />
            </View>
          </View>
        </View>
      )}

      <View style={{ marginTop: "auto" }}>
        <Button
          label={t("log.saveEntry")}
          onPress={onSave}
          disabled={!category || numericAmount <= 0}
          testID="save-entry"
        />
      </View>

      {/* Numpad Bottom Sheet */}
      <Modal visible={showNumpad} transparent animationType="slide" onRequestClose={() => setShowNumpad(false)}>
        <SafeAreaView style={[styles.sheetOverlay, { backgroundColor: colors.scrim }]}>
          <TouchableOpacity style={styles.sheetBackdrop} onPress={() => setShowNumpad(false)} activeOpacity={1} />
          <View style={[styles.sheetContent, { backgroundColor: colors.surface }]}>
            <View style={styles.sheetHeader}>
              <Text size="h3" weight="700">{t("log.howMuch")}</Text>
              <TouchableOpacity onPress={() => setShowNumpad(false)} hitSlop={12}>
                <X size={24} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <View style={styles.sheetDisplay}>
              <Text size="h2" weight="600" tone="muted">₹</Text>
              <Text size="display" weight="800" numeric style={styles.sheetAmount}>
                {amount ? formatNumberIndian(amount) : "0"}
              </Text>
            </View>

            {isLargeExpense ? (
              <Caption weight="600" style={{ color: colors.warning, textAlign: "center", marginBottom: 12 }}>
                {t("log.aboveTypical", { amount: formatCurrency(rollAvg, lang) })}
              </Caption>
            ) : null}

            <SheetNumpad value={amount} onChange={setAmount} />

            <View style={{ marginTop: 20 }}>
              <Button
                label={t("common.done")}
                onPress={() => {
                  void haptics.tap();
                  setShowNumpad(false);
                }}
                size="lg"
              />
            </View>
          </View>
        </SafeAreaView>
      </Modal>

      <SuccessCelebration
        visible={celebrating}
        title={t("log.entrySaved")}
        body={category ? `${formatCurrency(numericAmount, lang)} · ${t(`categories.${category}`)}` : formatCurrency(numericAmount, lang)}
        onDone={onCelebrationDone}
      />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  catGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  catTile: {
    width: "31%",
    aspectRatio: 1,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  catCheck: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedBlock: {
    gap: 16,
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  voiceSection: {
    gap: 4,
  },
  transcriptField: {
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 80,
    marginTop: 12,
  },
  transcriptInput: {
    fontSize: 14,
    textAlignVertical: "top",
    flex: 1,
    padding: 0,
  },
  sheetOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheetBackdrop: {
    flex: 1,
  },
  sheetContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sheetDisplay: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 16,
  },
  sheetAmount: {
    fontVariant: ["tabular-nums"],
  },
});
