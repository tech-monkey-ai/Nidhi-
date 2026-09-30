// NIDHI — Notification copy helper (used by the notifications scheduler).
// Pulls from the same i18n dictionaries but without React context (since the scheduler
// runs outside the React tree).

import type { Language } from "./types";
import en from "@/strings/en.json";
import hi from "@/strings/hi.json";
import kn from "@/strings/kn.json";

const DICTS: Record<Language, Record<string, string>> = { en, hi, kn };

export function i18nForNotifications(lang: Language) {
  const dict = DICTS[lang] ?? DICTS.en;
  const fallback = DICTS.en;
  return (key: string, vars?: Record<string, string | number>): string => {
    let str = dict[key] ?? fallback[key] ?? key;
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        str = str.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
      }
    }
    return str;
  };
}
