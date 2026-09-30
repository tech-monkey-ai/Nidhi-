// NIDHI — Local notifications via expo-notifications.
// Five distinct types, each toggleable per the user's settings.
// All copy is supportive, never shaming. No red alerts — only amber check-ins.
//
// CRITICAL — SDK 57 compatibility:
//   `expo-notifications` may not be fully initialized in all environments
//   (Expo Go with mismatched versions, dev builds without the plugin, etc).
//   Calling `Notifications.setNotificationHandler()` when the native module
//   isn't ready throws "cannot read property 'setNotificationHandler' of
//   undefined" or similar. We wrap EVERY call in try/catch so the app
//   never crashes — notifications just silently don't work.

import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import type { EMI, NotificationSettings, AppState } from "./types";
import { addMonths, formatCurrency } from "./format";
import { i18nForNotifications } from "./i18n-notifications";

// Notification identifiers (for scheduling/cancelling)
const ID_DAILY_LOG = "nidhi-daily-log";
const ID_SAVINGS_NUDGE = "nidhi-savings-nudge";
const ID_EMI_PREFIX = "nidhi-emi-";
const CHANNEL_DEFAULT = "nidhi-default";
const CHANNEL_REMINDER = "nidhi-reminders";
const CHANNEL_MILESTONE = "nidhi-milestones";

// Check if the Notifications module is available at runtime.
// In some environments (certain Expo Go versions, web, or when the native
// module isn't linked), Notifications or its methods may be undefined.
function isNotificationsAvailable(): boolean {
  try {
    return !!Notifications && typeof Notifications.setNotificationHandler === "function";
  } catch {
    return false;
  }
}

export async function initNotifications(): Promise<NotificationSettings | null> {
  if (!isNotificationsAvailable()) {
    console.warn("[notifications] Module not available — skipping init.");
    return null;
  }

  try {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
        priority: Notifications.AndroidNotificationPriority.DEFAULT,
      }),
    });
  } catch (e) {
    console.warn("[notifications] setNotificationHandler failed:", e);
  }

  try {
    const perm = await Notifications.requestPermissionsAsync({
      ios: { allowAlert: true, allowBadge: false, allowSound: true },
      android: {},
    });
    if (!perm.granted) return null;
  } catch (e) {
    console.warn("[notifications] requestPermissionsAsync failed:", e);
    return null;
  }

  if (Platform.OS === "android") {
    try {
      await Notifications.setNotificationChannelAsync(CHANNEL_DEFAULT, {
        name: "Nidhi",
        description: "General notifications from Nidhi",
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 120, 80, 120],
        lightColor: "#0F9D58",
      });
      await Notifications.setNotificationChannelAsync(CHANNEL_REMINDER, {
        name: "Reminders",
        description: "Daily and scheduled reminders",
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 120, 80, 120],
        lightColor: "#0F9D58",
      });
      await Notifications.setNotificationChannelAsync(CHANNEL_MILESTONE, {
        name: "Milestones",
        description: "Positive savings milestones",
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 200, 100, 200],
        lightColor: "#10B981",
      });
    } catch (e) {
      console.warn("[notifications] setNotificationChannelAsync failed:", e);
    }
  }

  return null;
}

export async function cancelAllScheduled(): Promise<void> {
  if (!isNotificationsAvailable()) return;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (e) {
    console.warn("[notifications] cancelAllScheduled failed:", e);
  }
}

// --- Daily log reminder (end of day) ---
export async function scheduleDailyLogReminder(
  enabled: boolean,
  lang: AppState["language"],
  hour = 20,
  minute = 0,
): Promise<void> {
  if (!isNotificationsAvailable()) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(ID_DAILY_LOG);
    if (!enabled) return;
    const t = i18nForNotifications(lang);
    await Notifications.scheduleNotificationAsync({
      identifier: ID_DAILY_LOG,
      content: {
        title: t("notifications.dailyLogTitle"),
        body: t("notifications.dailyLogBody"),
        sound: true,
        data: { type: "daily_log" },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
        repeats: true,
        channelId: CHANNEL_REMINDER,
      } as Notifications.DailyTriggerInput,
    });
  } catch (e) {
    console.warn("[notifications] scheduleDailyLogReminder failed:", e);
  }
}

// --- Weekly set-aside nudge ---
export async function scheduleSavingsNudge(
  enabled: boolean,
  lang: AppState["language"],
  weekday = 6,
  hour = 19,
  minute = 0,
): Promise<void> {
  if (!isNotificationsAvailable()) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(ID_SAVINGS_NUDGE);
    if (!enabled) return;
    const t = i18nForNotifications(lang);
    await Notifications.scheduleNotificationAsync({
      identifier: ID_SAVINGS_NUDGE,
      content: {
        title: t("notifications.savingsNudgeTitle"),
        body: t("notifications.savingsNudgeBody"),
        sound: true,
        data: { type: "savings_nudge" },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday,
        hour,
        minute,
        repeats: true,
        channelId: CHANNEL_REMINDER,
      } as Notifications.WeeklyTriggerInput,
    });
  } catch (e) {
    console.warn("[notifications] scheduleSavingsNudge failed:", e);
  }
}

// --- EMI due reminders (a day before each EMI's next due date) ---
export async function scheduleEmiReminders(
  emis: EMI[],
  enabled: boolean,
  lang: AppState["language"],
): Promise<void> {
  if (!isNotificationsAvailable()) return;
  try {
    for (const emi of emis) {
      await Notifications.cancelScheduledNotificationAsync(ID_EMI_PREFIX + emi.id);
    }
    if (!enabled || emis.length === 0) return;
    const t = i18nForNotifications(lang);
    const now = new Date();
    for (const emi of emis) {
      if (emi.elapsedMonths >= emi.durationMonths) continue;
      const nextDue = new Date(addMonths(emi.startDate, emi.elapsedMonths + 1));
      const reminderDay = new Date(nextDue);
      reminderDay.setDate(nextDue.getDate() - 1);
      if (reminderDay.getTime() <= now.getTime()) continue;
      await Notifications.scheduleNotificationAsync({
        identifier: ID_EMI_PREFIX + emi.id,
        content: {
          title: t("notifications.emiDueTitle"),
          body: t("notifications.emiDueBody", {
            description: emi.description || "EMI",
            amount: formatCurrency(emi.amount, lang),
          }),
          sound: true,
          data: { type: "emi_due", emiId: emi.id },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: reminderDay,
          channelId: CHANNEL_REMINDER,
        } as Notifications.DateTriggerInput,
      });
    }
  } catch (e) {
    console.warn("[notifications] scheduleEmiReminders failed:", e);
  }
}

// --- One-shot large-expense check-in ---
export async function fireLargeExpenseCheckin(
  lang: AppState["language"],
  categoryName: string,
): Promise<void> {
  if (!isNotificationsAvailable()) return;
  try {
    const t = i18nForNotifications(lang);
    await Notifications.scheduleNotificationAsync({
      identifier: "nidhi-large-expense-" + Date.now(),
      content: {
        title: t("notifications.largeExpenseTitle"),
        body: t("notifications.largeExpenseBody", { category: categoryName }),
        sound: true,
        data: { type: "large_expense" },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 5,
        channelId: CHANNEL_REMINDER,
      } as Notifications.TimeIntervalTriggerInput,
    });
  } catch (e) {
    console.warn("[notifications] fireLargeExpenseCheckin failed:", e);
  }
}

// --- Emergency Fund milestone ---
export async function fireEmergencyMilestone(
  lang: AppState["language"],
): Promise<void> {
  if (!isNotificationsAvailable()) return;
  try {
    const t = i18nForNotifications(lang);
    await Notifications.scheduleNotificationAsync({
      identifier: "nidhi-emergency-milestone-" + Date.now(),
      content: {
        title: t("notifications.emergencyMilestoneTitle"),
        body: t("notifications.emergencyMilestoneBody"),
        sound: true,
        data: { type: "emergency_milestone" },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 2,
        channelId: CHANNEL_MILESTONE,
      } as Notifications.TimeIntervalTriggerInput,
    });
  } catch (e) {
    console.warn("[notifications] fireEmergencyMilestone failed:", e);
  }
}

// --- Re-sync everything based on user settings ---
export async function syncScheduledNotifications(state: AppState): Promise<void> {
  const { notifications, emis, language } = state;
  await scheduleDailyLogReminder(notifications.dailyLogReminder, language);
  await scheduleSavingsNudge(notifications.savingsNudge, language);
  await scheduleEmiReminders(emis, notifications.emiDueReminder, language);
}

export type { NotificationSettings };
