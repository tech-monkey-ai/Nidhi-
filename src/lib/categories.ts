// NIDHI — Spending categories with vector icons
// Each category maps to a lucide-react-native icon + warm brand-aligned color.

import type { CategoryId } from "./types";

export interface CategoryDef {
  id: CategoryId;
  // lucide icon name (string for portability)
  iconName:
    | "Utensils"
    | "Bus"
    | "Landmark"
    | "Home"
    | "HeartPulse"
    | "Wallet";
  // brand-aligned color token name (looked up in theme)
  colorToken:
    | "catFood"
    | "catTransport"
    | "catEmi"
    | "catRent"
    | "catHealth"
    | "catOther";
}

export const CATEGORIES: Record<CategoryId, CategoryDef> = {
  food:        { id: "food",     iconName: "Utensils",    colorToken: "catFood" },
  transport:   { id: "transport",iconName: "Bus",         colorToken: "catTransport" },
  emi_loan:    { id: "emi_loan",iconName: "Landmark",    colorToken: "catEmi" },
  rent:        { id: "rent",     iconName: "Home",        colorToken: "catRent" },
  health:      { id: "health",   iconName: "HeartPulse",  colorToken: "catHealth" },
  other:       { id: "other",    iconName: "Wallet",      colorToken: "catOther" },
};

export const CATEGORY_ORDER: CategoryId[] = [
  "food",
  "transport",
  "emi_loan",
  "rent",
  "health",
  "other",
];
