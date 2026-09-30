// NIDHI — Typography scale (v4 — phone-optimized, readable, not cramped)
// Designed for 360-414px phone screens.

export type FontWeight = "400" | "500" | "600" | "700" | "800";

export const FONT_UI = "Onest";
export const FONT_NUMERIC = "Inter";
export const FONT_HINDI = "NotoSansDevanagari";
export const FONT_KANNADA = "NotoSansKannada";

import OnestRegular from "../../assets/fonts/Onest-Regular.ttf";
import OnestMedium from "../../assets/fonts/Onest-Medium.ttf";
import OnestSemiBold from "../../assets/fonts/Onest-SemiBold.ttf";
import OnestBold from "../../assets/fonts/Onest-Bold.ttf";
import OnestExtraBold from "../../assets/fonts/Onest-ExtraBold.ttf";
import InterRegular from "../../assets/fonts/Inter-Regular.ttf";
import InterSemiBold from "../../assets/fonts/Inter-SemiBold.ttf";
import InterBold from "../../assets/fonts/Inter-Bold.ttf";
import InterExtraBold from "../../assets/fonts/Inter-ExtraBold.ttf";
import NotoDevanagariRegular from "../../assets/fonts/NotoSansDevanagari-Regular.ttf";
import NotoDevanagariSemiBold from "../../assets/fonts/NotoSansDevanagari-SemiBold.ttf";
import NotoDevanagariBold from "../../assets/fonts/NotoSansDevanagari-Bold.ttf";
import NotoKannadaRegular from "../../assets/fonts/NotoSansKannada-Regular.ttf";
import NotoKannadaSemiBold from "../../assets/fonts/NotoSansKannada-SemiBold.ttf";
import NotoKannadaBold from "../../assets/fonts/NotoSansKannada-Bold.ttf";

export const FONT_ASSETS = {
  "Onest-Regular": OnestRegular,
  "Onest-Medium": OnestMedium,
  "Onest-SemiBold": OnestSemiBold,
  "Onest-Bold": OnestBold,
  "Onest-ExtraBold": OnestExtraBold,
  "Inter-Regular": InterRegular,
  "Inter-SemiBold": InterSemiBold,
  "Inter-Bold": InterBold,
  "Inter-ExtraBold": InterExtraBold,
  "NotoSansDevanagari-Regular": NotoDevanagariRegular,
  "NotoSansDevanagari-SemiBold": NotoDevanagariSemiBold,
  "NotoSansDevanagari-Bold": NotoDevanagariBold,
  "NotoSansKannada-Regular": NotoKannadaRegular,
  "NotoSansKannada-SemiBold": NotoKannadaSemiBold,
  "NotoSansKannada-Bold": NotoKannadaBold,
} as const;

export function weightSuffix(w: FontWeight): string {
  switch (w) {
    case "400": return "Regular";
    case "500": return "Medium";
    case "600": return "SemiBold";
    case "700": return "Bold";
    case "800": return "ExtraBold";
  }
}

export function uiFont(w: FontWeight = "400"): string {
  return `Onest-${weightSuffix(w)}`;
}

export function numericFont(w: FontWeight = "600"): string {
  return `Inter-${weightSuffix(w)}`;
}

export function hindiFont(w: FontWeight = "400"): string {
  return `NotoSansDevanagari-${weightSuffix(w)}`;
}

export function kannadaFont(w: FontWeight = "400"): string {
  return `NotoSansKannada-${weightSuffix(w)}`;
}

export function text(
  family: "ui" | "numeric" | "hindi" | "kannada",
  weight: FontWeight = "400",
): { fontFamily: string } {
  switch (family) {
    case "ui":      return { fontFamily: uiFont(weight) };
    case "numeric": return { fontFamily: numericFont(weight) };
    case "hindi":   return { fontFamily: hindiFont(weight) };
    case "kannada": return { fontFamily: kannadaFont(weight) };
  }
}

// Phone-optimized typography scale
export const TYPE_SCALE = {
  display:    { size: 30, lineHeight: 36 },  // hero amounts — fits phone width
  h1:         { size: 22, lineHeight: 28 },  // screen titles
  h2:         { size: 18, lineHeight: 24 },  // section headers
  h3:         { size: 16, lineHeight: 22 },  // card titles
  body:       { size: 14, lineHeight: 20 },  // body text
  bodySmall:  { size: 13, lineHeight: 18 },  // secondary text
  caption:    { size: 11, lineHeight: 16 },  // captions
  micro:      { size: 10, lineHeight: 14 },  // labels
} as const;

export type TypeSize = keyof typeof TYPE_SCALE;
