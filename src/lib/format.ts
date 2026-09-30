// NIDHI — Indian formatting helpers (currency, numbers, dates)

import type { Language } from "./types";

const LOCALE_MAP: Record<Language, string> = {
  en: "en-IN",
  hi: "hi-IN",
  kn: "kn-IN",
};

export function formatCurrency(amount: number, _lang: Language = "en"): string {
  const rounded = Math.round(amount);
  const sign = rounded < 0 ? "-" : "";
  const abs = Math.abs(rounded);
  const str = abs.toLocaleString("en-IN"); // Indian grouping 1,00,000
  return `${sign}₹${str}`;
}

export function formatNumber(amount: number, lang: Language = "en"): string {
  return amount.toLocaleString(LOCALE_MAP[lang] ?? "en-IN");
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

export function formatDate(iso: string, lang: Language = "en"): string {
  const d = new Date(iso);
  return d.toLocaleDateString(LOCALE_MAP[lang] ?? "en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatTime(iso: string, lang: Language = "en"): string {
  const d = new Date(iso);
  return d.toLocaleTimeString(LOCALE_MAP[lang] ?? "en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function isSameDay(iso1: string, iso2: string): boolean {
  const d1 = new Date(iso1);
  const d2 = new Date(iso2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export function isToday(iso: string): boolean {
  return isSameDay(iso, new Date().toISOString());
}

export function isSameWeek(iso1: string, iso2: string): boolean {
  const d1 = new Date(iso1);
  const d2 = new Date(iso2);
  const weekStart1 = new Date(d1);
  weekStart1.setDate(d1.getDate() - d1.getDay());
  weekStart1.setHours(0, 0, 0, 0);
  const weekStart2 = new Date(d2);
  weekStart2.setDate(d2.getDate() - d2.getDay());
  weekStart2.setHours(0, 0, 0, 0);
  return weekStart1.getTime() === weekStart2.getTime();
}

export function isSameMonth(iso1: string, iso2: string): boolean {
  const d1 = new Date(iso1);
  const d2 = new Date(iso2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth()
  );
}

export function daysAgo(iso: string): number {
  const d = new Date(iso);
  const now = new Date();
  return Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
}

export function greetingKey(): "morning" | "afternoon" | "evening" {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}

// Parse a free-form number into paise-free rupees. Returns NaN if invalid.
export function parseAmount(input: string): number {
  if (!input) return NaN;
  const cleaned = input.replace(/[^0-9.]/g, "");
  if (!cleaned) return NaN;
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : NaN;
}

// Add months to an ISO date (for EMI due calculation)
export function addMonths(iso: string, months: number): string {
  const d = new Date(iso);
  d.setMonth(d.getMonth() + months);
  return d.toISOString();
}
