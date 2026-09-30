// NIDHI — Locked Savings & Emergency Fund (premium polish)

import React, { useState } from "react";
import { View, StyleSheet, Alert, TouchableOpacity } from "react-native";
import {
  PiggyBank,
  Shield,
  Plus,
  Phone,
  Trash2,
  History,
} from "lucide-react-native";
import { useTheme } from "@/components/useTheme";
import { useI18n } from "@/lib/i18n";
import {
  useAppStore,
  useTotalLockedSavings,
  useTotalEmergencySavings,
  useSavingsThisMonth,
} from "@/store/appStore";
import { Header } from "@/components/ui/Header";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AmountField } from "@/components/ui/AmountField";
import { TextField } from "@/components/ui/TextField";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ScreenShell } from "@/components/ui/ScreenShell";
import { Text, Body, Caption, Micro } from "@/components/ui/Text";
import {
  formatCurrency,
  formatDate,
} from "@/lib/format";
import { fireEmergencyMilestone } from "@/lib/notifications";
import { validateAmount, validatePhone, validateName } from "@/lib/validation";
import * as haptics from "@/lib/haptics";

type Tab = "locked" | "emergency";

export default function SavingsScreen() {
  const { colors } = useTheme();
  const { t, lang } = useI18n();
  const state = useAppStore();
  const addSavings = useAppStore((s) => s.addSavings);
  const recordEmergencyAccess = useAppStore((s) => s.recordEmergencyAccess);
  const setTrustedContact = useAppStore((s) => s.setTrustedContact);

  const lockedTotal = useTotalLockedSavings();
  const emergencyTotal = useTotalEmergencySavings();
  const lockedMonth = useSavingsThisMonth("locked");

  const [tab, setTab] = useState<Tab>("locked");
  const [setAsideAmount, setSetAsideAmount] = useState("");
  const [accessAmount, setAccessAmount] = useState("");
  const [accessReason, setAccessReason] = useState("");

  const [showTrusted, setShowTrusted] = useState(false);
  const [tcName, setTcName] = useState(state.trustedContact?.name ?? "");
  const [tcPhone, setTcPhone] = useState(state.trustedContact?.phone ?? "");

  const saveSetAside = () => {
    const v = validateAmount(setAsideAmount);
    if (!v.ok || !v.value || v.value <= 0) return;
    void haptics.success();
    addSavings({
      date: new Date().toISOString(),
      amount: v.value,
      type: tab,
    });
    setSetAsideAmount("");

    if (tab === "emergency") {
      const newTotal = emergencyTotal + v.value;
      if (emergencyTotal < state.emergencyFundTarget && newTotal >= state.emergencyFundTarget) {
        void fireEmergencyMilestone(lang);
        void haptics.celebration();
      }
    }

    Alert.alert(t("savings.title"), t("savings.markedDone"));
  };

  const accessEmergency = () => {
    const v = validateAmount(accessAmount);
    if (!v.ok || !v.value || v.value <= 0) return;
    void haptics.warning();
    Alert.alert(
      t("savings.accessConfirmTitle"),
      t("savings.accessConfirmBody"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.confirm"),
          style: "destructive",
          onPress: () => {
            recordEmergencyAccess({
              date: new Date().toISOString(),
              amount: v.value!,
              reason: accessReason.trim(),
            });
            setAccessAmount("");
            setAccessReason("");
            Alert.alert(t("savings.title"), t("savings.emergencyAccessed"));
          },
        },
      ],
    );
  };

  const saveTrustedContact = () => {
    const nameV = validateName(tcName);
    const phoneV = validatePhone(tcPhone);
    if (!nameV.ok || !phoneV.ok) return;
    void haptics.success();
    setTrustedContact({ name: nameV.value!, phone: phoneV.value! });
    setShowTrusted(false);
  };

  return (
    <ScreenShell>
      <Header title={t("savings.title")} />

      {/* Tab switcher */}
      <View style={[styles.tabRow, { backgroundColor: colors.surfaceMuted, borderColor: colors.border }]}>
        {(["locked", "emergency"] as Tab[]).map((tk) => {
          const active = tab === tk;
          return (
            <TouchableOpacity
              key={tk}
              style={[
                styles.tab,
                {
                  backgroundColor: active ? colors.surface : "transparent",
                  borderColor: active ? colors.border : "transparent",
                },
              ]}
              onPress={() => {
                void haptics.tap();
                setTab(tk);
              }}
              accessibilityRole="button"
            >
              <Body weight="600" tone={active ? "primary" : "muted"}
                style={{ color: active ? colors.textPrimary : colors.textMuted }}>
                {tk === "locked" ? t("savings.lockedTab") : t("savings.emergencyTab")}
              </Body>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Hero */}
      <Card padding="lg" elevation="lg"
        style={{ backgroundColor: tab === "locked" ? colors.primarySoft : colors.warningSoft, borderWidth: 0 }}>
        <View style={styles.rowBetween}>
          <View style={styles.rowLeft}>
            {tab === "locked" ? (
              <PiggyBank size={28} color={colors.primaryDeep} />
            ) : (
              <Shield size={28} color={colors.warning} />
            )}
            <View>
              <Micro weight="700" style={{ color: tab === "locked" ? colors.primaryDeep : colors.warning, textTransform: "uppercase", letterSpacing: 0.6 }}>
                {tab === "locked" ? t("savings.lockedTab") : t("savings.emergencyTab")}
              </Micro>
              <Text size="h1" weight="800" numeric style={{ color: colors.textPrimary, marginTop: 2 }}>
                {formatCurrency(tab === "locked" ? lockedTotal : emergencyTotal, lang)}
              </Text>
            </View>
          </View>
        </View>
        <Caption style={{ color: colors.textPrimary, opacity: 0.7, marginTop: 12, lineHeight: 18 }}>
          {tab === "locked" ? t("savings.lockedDesc") : t("savings.emergencyDesc")}
        </Caption>
      </Card>

      {/* Progress */}
      <Card elevation="sm">
        <Body weight="700">
          {tab === "locked" ? t("savings.monthlyGoal") : t("savings.target")}
        </Body>
        <View style={styles.progressRow}>
          <Text size="h2" weight="700" numeric>
            {formatCurrency(tab === "locked" ? lockedMonth : emergencyTotal, lang)}
          </Text>
          <Caption tone="muted" numeric>
            {" / "}
            {formatCurrency(tab === "locked" ? state.savingsGoal : state.emergencyFundTarget, lang)}
          </Caption>
        </View>
        <View style={{ marginTop: 8 }}>
          <ProgressBar
            progress={
              tab === "locked"
                ? state.savingsGoal > 0 ? Math.min(1, lockedMonth / state.savingsGoal) : 0
                : state.emergencyFundTarget > 0 ? Math.min(1, emergencyTotal / state.emergencyFundTarget) : 0
            }
            color={tab === "locked" ? colors.primary : colors.warning}
          />
        </View>
      </Card>

      {/* Set aside */}
      <Card elevation="sm">
        <Body weight="700">{t("savings.setProgress")}</Body>
        <View style={{ height: 12 }} />
        <AmountField
          label={t("savings.howMuchSetAside")}
          value={setAsideAmount}
          onChange={setSetAsideAmount}
          placeholder="0"
        />
        <View style={{ height: 12 }} />
        <Button
          label={t("savings.markDone")}
          onPress={saveSetAside}
          icon={<Plus size={18} color="#FFFFFF" />}
          disabled={!validateAmount(setAsideAmount).ok || (validateAmount(setAsideAmount).value ?? 0) <= 0}
        />
      </Card>

      {/* Emergency-only: access + history + trusted contact */}
      {tab === "emergency" ? (
        <>
          <Card elevation="sm">
            <Body weight="700">{t("savings.accessEmergency")}</Body>
            <View style={{ height: 12 }} />
            <AmountField
              label={t("savings.howMuchAccess")}
              value={accessAmount}
              onChange={setAccessAmount}
              placeholder="0"
            />
            <View style={{ height: 12 }} />
            <TextField
              label={t("savings.whyAccess")}
              value={accessReason}
              onChange={setAccessReason}
              placeholder={t("common.optional")}
              multiline
            />
            <View style={{ height: 12 }} />
            <Button
              label={t("savings.accessEmergency")}
              onPress={accessEmergency}
              variant="warning"
              icon={<Shield size={18} color="#FFFFFF" />}
              disabled={!validateAmount(accessAmount).ok || (validateAmount(accessAmount).value ?? 0) <= 0}
            />
          </Card>

          {state.emergencyAccessRecords.length > 0 ? (
            <Card elevation="sm">
              <View style={styles.rowBetween}>
                <View style={styles.rowLeft}>
                  <History size={18} color={colors.textMuted} />
                  <Body weight="700">{t("savings.accessHistory")}</Body>
                </View>
              </View>
              <View style={styles.entryList}>
                {state.emergencyAccessRecords.slice(0, 5).map((r) => (
                  <View key={r.id} style={[styles.entryRow, { borderColor: colors.border }]}>
                    <View>
                      <Text size="h3" weight="700" numeric>
                        {formatCurrency(r.amount, lang)}
                      </Text>
                      <Caption tone="muted" style={{ marginTop: 2 }}>
                        {formatDate(r.date, lang)}
                      </Caption>
                      {r.reason ? (
                        <Caption tone="muted" style={{ marginTop: 2, fontStyle: "italic" }} numberOfLines={2}>
                          {r.reason}
                        </Caption>
                      ) : null}
                    </View>
                  </View>
                ))}
              </View>
            </Card>
          ) : (
            <Card>
              <Caption tone="muted" align="center" style={{ paddingVertical: 8 }}>
                {t("savings.noAccessHistory")}
              </Caption>
            </Card>
          )}

          <Card elevation="sm">
            <View style={styles.rowBetween}>
              <View style={styles.rowLeft}>
                <Phone size={18} color={colors.textPrimary} />
                <Body weight="700">{t("savings.trustedContact")}</Body>
              </View>
            </View>
            <Caption tone="muted" style={{ marginTop: 4, marginBottom: 12, lineHeight: 17 }}>
              {t("savings.trustedContactHint")}
            </Caption>

            {state.trustedContact ? (
              <View style={[styles.contactRow, { borderColor: colors.border, backgroundColor: colors.surfaceMuted }]}>
                <View>
                  <Body weight="600">{state.trustedContact.name}</Body>
                  <Caption tone="muted" numeric style={{ marginTop: 2 }}>
                    {state.trustedContact.phone}
                  </Caption>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    void haptics.tap();
                    setTrustedContact(null);
                  }}
                  accessibilityRole="button"
                >
                  <Trash2 size={18} color={colors.textMuted} />
                </TouchableOpacity>
              </View>
            ) : null}

            {showTrusted || !state.trustedContact ? (
              <View style={styles.formBlock}>
                <TextField
                  label={t("savings.trustedContactName")}
                  value={tcName}
                  onChange={setTcName}
                  placeholder={t("savings.trustedContactName")}
                />
                <View style={{ height: 12 }} />
                <TextField
                  label={t("savings.trustedContactPhone")}
                  value={tcPhone}
                  onChange={setTcPhone}
                  placeholder="+91 …"
                  keyboardType="phone-pad"
                />
                <View style={{ height: 12 }} />
                <Button
                  label={t("common.save")}
                  onPress={saveTrustedContact}
                  size="md"
                  disabled={!validateName(tcName).ok || !validatePhone(tcPhone).ok}
                />
              </View>
            ) : (
              <Button
                label={t("savings.addTrustedContact")}
                variant="outline"
                onPress={() => setShowTrusted(true)}
                icon={<Plus size={18} color={colors.textPrimary} />}
              />
            )}
          </Card>
        </>
      ) : null}
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
  progressRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
    marginTop: 8,
  },
  entryList: {
    marginTop: 8,
    gap: 8,
  },
  entryRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 4,
  },
  formBlock: {
    marginTop: 12,
    gap: 0,
  },
});
