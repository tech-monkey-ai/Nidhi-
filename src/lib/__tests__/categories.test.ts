import {
  CATEGORIES,
  CATEGORY_ORDER,
  type CategoryDef,
} from "@/lib/categories";
import type { CategoryId } from "@/lib/types";

describe("categories", () => {
  it("exports all 6 categories", () => {
    expect(Object.keys(CATEGORIES)).toHaveLength(6);
    expect(CATEGORY_ORDER).toHaveLength(6);
  });

  it("includes food, transport, emi_loan, rent, health, other", () => {
    expect(CATEGORY_ORDER).toEqual([
      "food",
      "transport",
      "emi_loan",
      "rent",
      "health",
      "other",
    ]);
  });

  it("each category has the required fields", () => {
    for (const id of CATEGORY_ORDER) {
      const cat: CategoryDef = CATEGORIES[id as CategoryId];
      expect(cat.id).toBe(id);
      expect(cat.iconName).toBeTruthy();
      expect(cat.colorToken).toBeTruthy();
    }
  });

  it("icon names are valid lucide icon names", () => {
    const validIcons = ["Utensils", "Bus", "Landmark", "Home", "HeartPulse", "Wallet"];
    for (const id of CATEGORY_ORDER) {
      const cat = CATEGORIES[id as CategoryId];
      expect(validIcons).toContain(cat.iconName);
    }
  });

  it("color tokens are valid theme keys", () => {
    const validTokens = ["catFood", "catTransport", "catEmi", "catRent", "catHealth", "catOther"];
    for (const id of CATEGORY_ORDER) {
      const cat = CATEGORIES[id as CategoryId];
      expect(validTokens).toContain(cat.colorToken);
    }
  });

  it("each category has a unique id", () => {
    const ids = CATEGORY_ORDER;
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("each category has a unique color token", () => {
    const tokens = CATEGORY_ORDER.map((id) => CATEGORIES[id].colorToken);
    const uniqueTokens = new Set(tokens);
    expect(uniqueTokens.size).toBe(tokens.length);
  });
});
