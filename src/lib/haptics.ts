// NIDHI — Haptics helper (wraps expo-haptics with safe fallbacks)
//
// Haptics are used sparingly for key moments:
//   - tap (Light)        — every button press
//   - press (Medium)     — primary CTA taps
//   - success (Success)  — when an entry saves, milestone reached
//   - warning (Warning)  — emergency access confirm
//   - error (Error)      — validation failures (rare — we prefer inline warnings)
//
// If expo-haptics is unavailable or the device doesn't support it, calls
// silently no-op so the app never crashes on haptics.

import * as Haptics from "expo-haptics";
import { Platform, Vibration } from "react-native";

type ImpactStyle = "Light" | "Medium" | "Heavy";
type NotificationType = "Success" | "Warning" | "Error";

const IMPACT_MAP: Record<ImpactStyle, Haptics.ImpactFeedbackStyle> = {
  Light: Haptics.ImpactFeedbackStyle.Light,
  Medium: Haptics.ImpactFeedbackStyle.Medium,
  Heavy: Haptics.ImpactFeedbackStyle.Heavy,
};

const NOTIF_MAP: Record<NotificationType, Haptics.NotificationFeedbackType> = {
  Success: Haptics.NotificationFeedbackType.Success,
  Warning: Haptics.NotificationFeedbackType.Warning,
  Error: Haptics.NotificationFeedbackType.Error,
};

export async function impact(style: ImpactStyle = "Light"): Promise<void> {
  try {
    await Haptics.impactAsync(IMPACT_MAP[style]);
  } catch {
    // Fallback to plain vibration on platforms where Haptics is unavailable
    if (Platform.OS === "android") {
      try { Vibration.vibrate(10); } catch {}
    }
  }
}

export async function notify(type: NotificationType): Promise<void> {
  try {
    await Haptics.notificationAsync(NOTIF_MAP[type]);
  } catch {
    // Silent fail — haptics is never critical
  }
}

export async function tap(): Promise<void> {
  await impact("Light");
}

export async function press(): Promise<void> {
  await impact("Medium");
}

export async function success(): Promise<void> {
  await notify("Success");
}

export async function warning(): Promise<void> {
  await notify("Warning");
}

export async function error(): Promise<void> {
  await notify("Error");
}

// Celebration pattern — used for milestone achievements (e.g. emergency fund target reached)
export async function celebration(): Promise<void> {
  try {
    await impact("Medium");
    setTimeout(() => impact("Heavy"), 120);
    setTimeout(() => impact("Medium"), 260);
    setTimeout(() => notify("Success"), 420);
  } catch {
    // Silent
  }
}
