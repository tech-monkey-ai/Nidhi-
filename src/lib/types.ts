// NIDHI — Core domain types (v2 — extended for richer functionality)

export type Language = "en" | "hi" | "kn";

export type CategoryId =
  | "food"
  | "transport"
  | "emi_loan"
  | "rent"
  | "health"
  | "other";

export interface EMI {
  id: string;
  amount: number;          // monthly EMI amount
  totalAmount: number;     // total loan amount
  durationMonths: number;  // total tenure
  elapsedMonths: number;   // months already paid (auto-incremented monthly)
  description: string;     // what it's for
  startDate: string;       // ISO date string (first EMI date)
  // NEW: pause / paid-off flag
  isActive: boolean;       // if false, EMI is paused or fully paid
}

export interface SpendingEntry {
  id: string;
  date: string;            // ISO timestamp
  category: CategoryId;
  amount: number;
  note?: string;           // optional voice transcript, stored as-is, never parsed
  // NEW: support editing with audit trail
  updatedAt?: string;
}

export interface SavingsEntry {
  id: string;
  date: string;            // ISO timestamp
  amount: number;
  type: "locked" | "emergency";
  note?: string;
}

export interface NotificationSettings {
  dailyLogReminder: boolean;
  largeExpenseAlert: boolean;
  emiDueReminder: boolean;
  savingsNudge: boolean;
  emergencyFundMilestone: boolean;
}

export interface TrustedContact {
  name: string;
  phone: string;
}

export interface EmergencyAccessRecord {
  id: string;
  date: string;
  amount: number;
  reason: string;
}

export interface AppState {
  // Onboarding
  isOnboarded: boolean;
  language: Language;
  userName: string;

  // Financial picture
  monthlyIncome: number;
  savingsGoal: number;            // monthly locked savings goal
  emergencyFundTarget: number;
  emis: EMI[];

  // Entries
  spendingEntries: SpendingEntry[];
  savingsEntries: SavingsEntry[];
  emergencyAccessRecords: EmergencyAccessRecord[];

  // Settings
  notifications: NotificationSettings;
  trustedContact: TrustedContact | null;
  voiceEnabled: boolean;
  darkModeOverride: "auto" | "light" | "dark";

  // Last seen date for daily reminder dedup
  lastLoggedDate: string | null;
}

export const DEFAULT_NOTIFICATIONS: NotificationSettings = {
  dailyLogReminder: true,
  largeExpenseAlert: true,
  emiDueReminder: true,
  savingsNudge: true,
  emergencyFundMilestone: true,
};

export function createInitialState(): AppState {
  return {
    isOnboarded: false,
    language: "en",
    userName: "",
    monthlyIncome: 0,
    savingsGoal: 0,
    emergencyFundTarget: 1000,
    emis: [],
    spendingEntries: [],
    savingsEntries: [],
    emergencyAccessRecords: [],
    notifications: { ...DEFAULT_NOTIFICATIONS },
    trustedContact: null,
    voiceEnabled: true,
    darkModeOverride: "auto",
    lastLoggedDate: null,
  };
}
