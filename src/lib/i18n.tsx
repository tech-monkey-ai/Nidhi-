// NIDHI — i18n provider (pure string-swap, identical layouts across languages)

import React, { createContext, useContext, useMemo, useState } from "react";
import type { Language } from "./types";
import en from "@/strings/en.json";
import hi from "@/strings/hi.json";
import kn from "@/strings/kn.json";

const DICTS: Record<Language, Record<string, string>> = {
  en,
  hi,
  kn,
};

interface I18nContextValue {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  initialLang = "en",
  children,
}: {
  initialLang?: Language;
  children: React.ReactNode;
}) {
  // Track the initial language at mount; if it changes later via the store,
  // we re-mount the provider via the `key` prop set in _layout.tsx.
  const [lang, setLang] = useState<Language>(initialLang);

  const value = useMemo<I18nContextValue>(() => ({
    lang,
    setLang,
    t: (key, vars) => {
      const dict = DICTS[lang] ?? DICTS.en;
      const fallback = DICTS.en[key] ?? key;
      let str = dict[key] ?? fallback;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          str = str.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
        }
      }
      return str;
    },
  }), [lang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}

export function useT() {
  return useI18n().t;
}
