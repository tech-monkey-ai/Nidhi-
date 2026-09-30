// NIDHI — Storage layer (AsyncStorage with versioned schema + migrations)
//
// Robust to schema changes: each new field added to AppState comes with a
// migration step that defaults the field on existing installations.
// Corrupt JSON is wiped and reset to initial state — never crashes the user.

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createInitialState, type AppState } from "./types";

const STORAGE_KEY = "nidhi:v1:state";
const SCHEMA_VERSION = 1;

interface StoredState extends AppState {
  __schemaVersion?: number;
}

export async function loadState(): Promise<AppState> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();
    const parsed = JSON.parse(raw) as StoredState;
    return migrate(parsed);
  } catch (e) {
    console.warn("[storage] load failed, resetting:", e);
    // Wipe corrupt state so the app can boot
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch {}
    return createInitialState();
  }
}

export async function saveState(state: AppState): Promise<void> {
  try {
    const toStore: StoredState = { ...state, __schemaVersion: SCHEMA_VERSION };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  } catch (e) {
    console.warn("[storage] save failed:", e);
  }
}

export async function clearState(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn("[storage] clear failed:", e);
  }
}

// Migration function — bumps older schemas forward.
function migrate(parsed: StoredState): AppState {
  const base = createInitialState();
  const version = parsed.__schemaVersion ?? 0;

  // Future-proof: each version adds new fields. We always merge with the
  // base initial state so new fields have safe defaults even on old installs.
  const merged: AppState = {
    ...base,
    ...parsed,
    // Always validate critical fields
    language: ["en", "hi", "kn"].includes(parsed.language) ? parsed.language : "en",
    monthlyIncome: Number.isFinite(parsed.monthlyIncome) ? parsed.monthlyIncome : 0,
    savingsGoal: Number.isFinite(parsed.savingsGoal) ? parsed.savingsGoal : 0,
    emergencyFundTarget: Number.isFinite(parsed.emergencyFundTarget)
      ? parsed.emergencyFundTarget
      : 1000,
    emis: Array.isArray(parsed.emis) ? parsed.emis : [],
    spendingEntries: Array.isArray(parsed.spendingEntries) ? parsed.spendingEntries : [],
    savingsEntries: Array.isArray(parsed.savingsEntries) ? parsed.savingsEntries : [],
    emergencyAccessRecords: Array.isArray(parsed.emergencyAccessRecords)
      ? parsed.emergencyAccessRecords
      : [],
    notifications: { ...base.notifications, ...(parsed.notifications ?? {}) },
    trustedContact: parsed.trustedContact ?? null,
    voiceEnabled: typeof parsed.voiceEnabled === "boolean" ? parsed.voiceEnabled : true,
    lastLoggedDate: parsed.lastLoggedDate ?? null,
    isOnboarded: typeof parsed.isOnboarded === "boolean" ? parsed.isOnboarded : false,
    userName: typeof parsed.userName === "string" ? parsed.userName : "",
  };

  if (version < SCHEMA_VERSION) {
    // Persist migrated version
    void saveState(merged);
  }

  return merged;
}
