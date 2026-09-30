// NIDHI — MicButton (final — reliable URI capture via status listener)

import React, { useState, useRef, useCallback } from "react";
import {
  TouchableOpacity,
  View,
  StyleSheet,
  ActivityIndicator,
  Text as RNText,
  Alert,
} from "react-native";
import { Mic, Square } from "lucide-react-native";
import {
  useAudioRecorder,
  RecordingPresets,
  setAudioModeAsync,
  requestRecordingPermissionsAsync,
  getRecordingPermissionsAsync,
} from "expo-audio";
import Constants from "expo-constants";
import { useTheme } from "@/components/useTheme";
import { useI18n } from "@/lib/i18n";
import { transcribeAudio } from "@/lib/voice";
import { useAppStore } from "@/store/appStore";
import * as haptics from "@/lib/haptics";

interface MicButtonProps {
  onTranscript: (text: string) => void;
}

export function MicButton({ onTranscript }: MicButtonProps) {
  const { colors } = useTheme();
  const t = useI18n().t;
  const voiceEnabled = useAppStore((s) => s.voiceEnabled);
  const [state, setState] = useState<"idle" | "recording" | "transcribing">("idle");

  // Store the recording URI when it becomes available
  const recordedUriRef = useRef<string | null>(null);

  const recorder = useAudioRecorder(
    RecordingPresets.HIGH_QUALITY,
    (status) => {
      // This callback fires when recording status changes
      if (status.isFinished && status.url) {
        console.log("[voice] Recording finished, URL:", status.url);
        recordedUriRef.current = status.url;
      }
    },
  );

  if (!voiceEnabled) return null;

  const ensurePermission = async (): Promise<boolean> => {
    try {
      const perm = await getRecordingPermissionsAsync();
      if (perm.granted) return true;
      const req = await requestRecordingPermissionsAsync();
      if (req.granted) return true;
      Alert.alert(t("appName"), t("voice.permissionBody"), [
        { text: t("common.ok") },
      ]);
      return false;
    } catch (e) {
      console.warn("[voice] permission check failed", e);
      return false;
    }
  };

  const startRecording = async () => {
    const ok = await ensurePermission();
    if (!ok) return;
    try {
      recordedUriRef.current = null;
      await setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });
      recorder.record();
      setState("recording");
    } catch (e) {
      console.warn("[voice] start failed", e);
      Alert.alert(t("appName"), t("voice.permissionDenied"));
    }
  };

  const stopAndTranscribe = async () => {
    try {
      setState("transcribing");

      // Stop recording
      await recorder.stop();

      // Wait for the status callback to fire with the URL
      // Try multiple times with increasing delays
      let uri = recordedUriRef.current;
      for (let i = 0; i < 10 && !uri; i++) {
        await new Promise((r) => setTimeout(r, 200));
        uri = recordedUriRef.current;
        if (uri) break;
      }

      // Also check recorder.uri as fallback
      if (!uri) {
        uri = recorder.uri;
        console.log("[voice] recorder.uri after wait:", uri);
      }

      if (!uri) {
        console.warn("[voice] No URI available after stop");
        Alert.alert(t("appName"), t("log.transcriptFailed"), [
          { text: t("common.ok") },
        ]);
        setState("idle");
        return;
      }

      console.log("[voice] Using audio URI:", uri);

      // Transcribe via Sarvam
      const result = await transcribeAudio(uri);

      if (result?.transcript) {
        console.log("[voice] Transcript received:", result.transcript.slice(0, 50));
        onTranscript(result.transcript);
        void haptics.success();
      } else {
        console.warn("[voice] No transcript returned from Sarvam");
        Alert.alert(t("appName"), t("log.transcriptFailed"), [
          { text: t("common.ok") },
        ]);
      }
    } catch (e) {
      console.warn("[voice] stop/transcribe failed", e);
      Alert.alert(t("appName"), t("log.transcriptFailed"), [
        { text: t("common.ok") },
      ]);
    } finally {
      try {
        await setAudioModeAsync({
          playsInSilentMode: false,
          allowsRecording: false,
        });
      } catch {}
      setState("idle");
    }
  };

  const onPress = () => {
    void haptics.tap();
    if (state === "idle") void startRecording();
    else if (state === "recording") void stopAndTranscribe();
  };

  const label = (() => {
    if (state === "recording") return t("log.tapToStop");
    if (state === "transcribing") return t("log.transcribing");
    return t("log.tapToRecord");
  })();

  const isConfigured = !!Constants.expoConfig?.extra?.sarvamApiKey;

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: state === "recording" ? colors.warning : colors.primary,
          },
        ]}
        onPress={onPress}
        disabled={state === "transcribing"}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        {state === "transcribing" ? (
          <ActivityIndicator color="#FFFFFF" size="large" />
        ) : state === "recording" ? (
          <Square size={28} color="#FFFFFF" fill="#FFFFFF" />
        ) : (
          <Mic size={28} color="#FFFFFF" />
        )}
      </TouchableOpacity>
      <RNText style={[styles.label, { color: colors.textMuted }]}>
        {label}
      </RNText>
      {!isConfigured && state === "idle" ? (
        <RNText style={[styles.hint, { color: colors.warning }]}>
          Set SARVAM_API_KEY in .env
        </RNText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    gap: 10,
  },
  button: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
  },
  hint: {
    fontSize: 11,
    textAlign: "center",
  },
});
