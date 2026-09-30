// NIDHI — Global app store (Zustand) — v2 with richer functionality
//
// Single source of truth for onboarding state, financial picture, entries,
// settings, and trusted contact. Persisted to AsyncStorage on every change.

import { create } from "zustand";
import {
  createInitialState,
  DEFAULT_NOTIFICATIONS,
  type AppState,
  type EMI,
  type SpendingEntry,
  type SavingsEntry,
  type CategoryId,
  type EmergencyAccessRecord,
  type Language,
  type NotificationSettings,
  type TrustedContact,
} from "@/lib/types";
import { saveState, loadState } from "@/lib/storage";

interface AppStoreActions {
  hydrate: () => Promise<void>;
  setLanguage: (lang: Language) => void;
  setOnboarded: (v: boolean) => void;
  setUserName: (name: string) => void;
  setFinancialPicture: (patch: Partial<Pick<AppState, "monthlyIncome" | "savingsGoal" | "emergencyFundTarget">>) => void;
  addEmi: (emi: Omit<EMI, "id" | "isActive"> & { isActive?: boolean }) => void;
  removeEmi: (id: string) => void;
  updateEmi: (id: string, patch: Partial<EMI>) => void;
  // NEW: EMI month tracking — bump paid months count
  incrementEmiMonth: (id: string) => void;
  // NEW: edit / delete spending entries
  addSpending: (entry: Omit<SpendingEntry, "id">) => SpendingEntry;
  updateSpending: (id: string, patch: Partial<SpendingEntry>) => void;
  deleteSpending: (id: string) => void;
  addSavings: (entry: Omit<SavingsEntry, "id">) => void;
  deleteSavings: (id: string) => void;
  recordEmergencyAccess: (rec: Omit<EmergencyAccessRecord, "id">) => void;
  setNotifications: (patch: Partial<NotificationSettings>) => void;
  setTrustedContact: (c: TrustedContact | null) => void;
  setVoiceEnabled: (enabled: boolean) => void;
  setDarkModeOverride: (v: "auto" | "light" | "dark") => void;
  resetAll: () => Promise<void>;
}

type Store = AppState & AppStoreActions & { _hydrated: boolean };

function uid(prefix = ""): string {
  return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

async function persist(state: AppState): Promise<void> {
  const { ...rest } = state as AppState & { _hydrated?: boolean };
  const { _hydrated, ...persistable } = rest as AppState & { _hydrated?: boolean };
  void _hydrated;
  await saveState(persistable);
}

export const useAppStore = create<Store>((set, get) => ({
  ...createInitialState(),
  _hydrated: false,

  hydrate: async () => {
    const loaded = await loadState();
    set({ ...loaded, _hydrated: true });
  },

  setLanguage: (lang) => {
    set({ language: lang });
    void persist(get());
  },

  setOnboarded: (v) => {
    set({ isOnboarded: v });
    void persist(get());
  },

  setUserName: (name) => {
    set({ userName: name.trim() });
    void persist(get());
  },

  setFinancialPicture: (patch) => {
    set(patch);
    void persist(get());
  },

  addEmi: (emi) => {
    const { isActive: incomingActive, ...restEmi } = emi;
    const newEmi: EMI = {
      id: uid("emi_"),
      isActive: typeof incomingActive === "boolean" ? incomingActive : true,
      ...restEmi,
    };
    set((s) => ({ emis: [...s.emis, newEmi] }));
    void persist(get());
  },

  removeEmi: (id) => {
    set((s) => ({ emis: s.emis.filter((e) => e.id !== id) }));
    void persist(get());
  },

  updateEmi: (id, patch) => {
    set((s) => ({
      emis: s.emis.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    }));
    void persist(get());
  },

  incrementEmiMonth: (id) => {
    set((s) => ({
      emis: s.emis.map((e) => {
        if (e.id !== id) return e;
        const next = { ...e, elapsedMonths: e.elapsedMonths + 1 };
        if (next.elapsedMonths >= e.durationMonths) next.isActive = false;
        return next;
      }),
    }));
    void persist(get());
  },

  addSpending: (entry) => {
    const newEntry: SpendingEntry = { id: uid("sp_"), ...entry };
    set((s) => ({
      spendingEntries: [newEntry, ...s.spendingEntries],
      lastLoggedDate: new Date().toISOString(),
    }));
    void persist(get());
    return newEntry;
  },

  updateSpending: (id, patch) => {
    set((s) => ({
      spendingEntries: s.spendingEntries.map((e) =>
        e.id === id ? { ...e, ...patch, updatedAt: new Date().toISOString() } : e
      ),
    }));
    void persist(get());
  },

  deleteSpending: (id) => {
    set((s) => ({
      spendingEntries: s.spendingEntries.filter((e) => e.id !== id),
    }));
    void persist(get());
  },

  addSavings: (entry) => {
    const newEntry: SavingsEntry = { id: uid("sv_"), ...entry };
    set((s) => ({ savingsEntries: [newEntry, ...s.savingsEntries] }));
    void persist(get());
  },

  deleteSavings: (id) => {
    set((s) => ({
      savingsEntries: s.savingsEntries.filter((e) => e.id !== id),
    }));
    void persist(get());
  },

  recordEmergencyAccess: (rec) => {
    const newRec: EmergencyAccessRecord = { id: uid("ea_"), ...rec };
    set((s) => ({ emergencyAccessRecords: [newRec, ...s.emergencyAccessRecords] }));
    void persist(get());
  },

  setNotifications: (patch) => {
    set((s) => ({ notifications: { ...s.notifications, ...patch } }));
    void persist(get());
  },

  setTrustedContact: (c) => {
    set({ trustedContact: c });
    void persist(get());
  },

  setVoiceEnabled: (enabled) => {
    set({ voiceEnabled: enabled });
    void persist(get());
  },

  setDarkModeOverride: (v) => {
    set({ darkModeOverride: v });
    void persist(get());
  },

  resetAll: async () => {
    set({ ...createInitialState(), _hydrated: true });
    void persist(get());
  },
}));

// --- Selectors ---

export function useTotalSpentThisMonth(): number {
  return useAppStore((s) => {
    const now = new Date();
    return s.spendingEntries
      .filter((e) => {
        const d = new Date(e.date);
        return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
      })
      .reduce((sum, e) => sum + e.amount, 0);
  });
}

export function useTotalLockedSavings(): number {
  return useAppStore((s) =>
    s.savingsEntries
      .filter((e) => e.type === "locked")
      .reduce((sum, e) => sum + e.amount, 0),
  );
}

export function useTotalEmergencySavings(): number {
  return useAppStore((s) =>
    s.savingsEntries
      .filter((e) => e.type === "emergency")
      .reduce((sum, e) => sum + e.amount, 0),
  );
}

export function useMonthlyEmiTotal(): number {
  return useAppStore((s) =>
    s.emis
      .filter((e) => e.isActive && e.elapsedMonths < e.durationMonths)
      .reduce((sum, e) => sum + e.amount, 0),
  );
}

export function useSavingsThisMonth(type: "locked" | "emergency"): number {
  return useAppStore((s) => {
    const now = new Date();
    return s.savingsEntries
      .filter((e) => {
        if (e.type !== type) return false;
        const d = new Date(e.date);
        return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
      })
      .reduce((sum, e) => sum + e.amount, 0);
  });
}

export function useCategoryRollingAverage(category: CategoryId, lookbackDays = 30): number {
  return useAppStore((s) => {
    const cutoff = Date.now() - lookbackDays * 24 * 60 * 60 * 1000;
    const entries = s.spendingEntries.filter(
      (e) => e.category === category && new Date(e.date).getTime() >= cutoff,
    );
    if (entries.length === 0) return 0;
    const total = entries.reduce((sum, e) => sum + e.amount, 0);
    return total / entries.length;
  });
}

export { DEFAULT_NOTIFICATIONS };
