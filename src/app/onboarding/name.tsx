// NIDHI — Onboarding: Name input (premium polish)

import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useI18n } from "@/lib/i18n";
import { useAppStore } from "@/store/appStore";
import { TextField } from "@/components/ui/TextField";
import { Button } from "@/components/ui/Button";
import { ScreenShell } from "@/components/ui/ScreenShell";
import { Header } from "@/components/ui/Header";
import { Caption } from "@/components/ui/Text";
import { BackButton } from "@/components/ui/BackButton";
import { validateName } from "@/lib/validation";
import * as haptics from "@/lib/haptics";

export default function NameScreen() {
  const { t } = useI18n();
  const router = useRouter();
  const setUserName = useAppStore((s) => s.setUserName);
  const stored = useAppStore((s) => s.userName);
  const [name, setName] = useState(stored);

  const onNext = () => {
    const v = validateName(name);
    if (!v.ok || !v.value) return;
    void haptics.success();
    setUserName(v.value);
    router.push("/onboarding/financial");
  };

  return (
    <ScreenShell>
      <View style={styles.topBar}>
        <BackButton fallbackHref="/onboarding/welcome" label={t("common.back")} />
      </View>
      <Header title={t("name.title")} subtitle={t("name.subtitle")} />
      <View style={styles.field}>
        <TextField
          label={t("name.placeholder")}
          value={name}
          onChange={setName}
          placeholder={t("name.placeholder")}
          autoFocus
          maxLength={40}
        />
      </View>
      <View style={{ marginTop: "auto" }}>
        <Button
          label={t("common.continue")}
          onPress={onNext}
          disabled={!validateName(name).ok}
          testID="name-continue"
        />
      </View>
      <Caption tone="muted" style={styles.hint}>{t("name.subtitle")}</Caption>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  topBar: {
    marginBottom: 4,
  },
  field: {
    marginTop: 24,
  },
  hint: {
    marginTop: 8,
  },
});
