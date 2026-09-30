// NIDHI — Input validation & sanitization utilities
//
// Centralised validators used across the app to:
//   - Prevent NaN / Infinity from entering storage
//   - Cap absurd values that would break layouts or arithmetic
//   - Sanitise free-form text (notes, descriptions, names)
//   - Validate phone numbers (Indian format)
//
// All validation failures are logged (warn) so we can spot regressions,
// but never crash the user's flow — callers receive a safe fallback.

const MAX_AMOUNT = 1_00_00_00_000; // ₹100 crore cap — generous but bounded
const MAX_TEXT_LENGTH = 200;
const MAX_NAME_LENGTH = 40;
const MAX_PHONE_LENGTH = 15;

export interface ValidationResult<T> {
  ok: boolean;
  value: T | null;
  reason?: string;
}

export function validateAmount(input: string | number): ValidationResult<number> {
  if (typeof input === "number") {
    if (!Number.isFinite(input)) return { ok: false, value: null, reason: "non-numeric" };
    if (input < 0) return { ok: false, value: 0, reason: "negative -> 0" };
    if (input > MAX_AMOUNT) {
      console.warn("[validate] amount capped from", input, "to", MAX_AMOUNT);
      return { ok: true, value: MAX_AMOUNT, reason: "capped" };
    }
    return { ok: true, value: input };
  }
  // String input: check for explicit negative before stripping
  const trimmed = input.trim();
  if (trimmed.startsWith("-")) return { ok: false, value: 0, reason: "negative -> 0" };
  const n = parseFloat(trimmed.replace(/[^0-9.]/g, ""));
  if (!Number.isFinite(n)) return { ok: false, value: null, reason: "non-numeric" };
  if (n > MAX_AMOUNT) {
    console.warn("[validate] amount capped from", n, "to", MAX_AMOUNT);
    return { ok: true, value: MAX_AMOUNT, reason: "capped" };
  }
  return { ok: true, value: n };
}

export function sanitizeText(input: string, max = MAX_TEXT_LENGTH): string {
  if (typeof input !== "string") return "";
  // Strip control chars + trim + cap length
  const cleaned = input.replace(/[\x00-\x08\x0B-\x1F\x7F]/g, "").trim();
  return cleaned.slice(0, max);
}

export function validateName(input: string): ValidationResult<string> {
  const cleaned = sanitizeText(input, MAX_NAME_LENGTH);
  if (!cleaned) return { ok: false, value: null, reason: "empty" };
  // Allow letters (incl. Devanagari, Kannada), spaces, hyphens, apostrophes, dots
  if (!/^[\p{L}\p{M}\s.\-']+$/u.test(cleaned)) {
    return { ok: false, value: cleaned, reason: "invalid chars" };
  }
  return { ok: true, value: cleaned };
}

export function validatePhone(input: string): ValidationResult<string> {
  if (typeof input !== "string") return { ok: false, value: null };
  // Strip whitespace, dashes, parens, leading +; keep digits only
  const digits = input.replace(/[^\d]/g, "").slice(0, MAX_PHONE_LENGTH);
  // Indian mobile: 10 digits starting 6-9, OR with country code 91 (12 digits total)
  if (/^[6-9]\d{9}$/.test(digits)) return { ok: true, value: digits };
  if (/^91[6-9]\d{9}$/.test(digits)) return { ok: true, value: digits };
  // Otherwise accept any 7-15 digit string (international)
  if (digits.length >= 7 && digits.length <= MAX_PHONE_LENGTH) {
    return { ok: true, value: digits };
  }
  return { ok: false, value: digits, reason: "invalid format" };
}

export function validateDurationMonths(input: string | number): ValidationResult<number> {
  const n = typeof input === "number" ? input : parseInt(String(input), 10);
  if (!Number.isFinite(n) || n < 1) return { ok: false, value: null, reason: "invalid" };
  if (n > 360) {
    console.warn("[validate] duration capped from", n, "to 360");
    return { ok: true, value: 360, reason: "capped" };
  }
  return { ok: true, value: Math.floor(n) };
}

export function validateLanguage(input: string): "en" | "hi" | "kn" {
  if (input === "en" || input === "hi" || input === "kn") return input;
  console.warn("[validate] unknown language", input, "-> en");
  return "en";
}
