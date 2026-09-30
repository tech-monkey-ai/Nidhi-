// Tests for the log.aboveTypical i18n key — verifies it exists in all 3 languages
// and renders the {amount} placeholder correctly.

import en from "@/strings/en.json";
import hi from "@/strings/hi.json";
import kn from "@/strings/kn.json";

const DICTS = { en, hi, kn } as const;

describe("log.aboveTypical i18n key", () => {
  it("exists in English", () => {
    expect(en["log.aboveTypical"]).toBeTruthy();
    expect(typeof en["log.aboveTypical"]).toBe("string");
  });

  it("exists in Hindi", () => {
    expect(hi["log.aboveTypical"]).toBeTruthy();
    expect(typeof hi["log.aboveTypical"]).toBe("string");
  });

  it("exists in Kannada", () => {
    expect(kn["log.aboveTypical"]).toBeTruthy();
    expect(typeof kn["log.aboveTypical"]).toBe("string");
  });

  it("contains the {amount} placeholder in all 3 languages", () => {
    for (const dict of Object.values(DICTS)) {
      const str = dict["log.aboveTypical"];
      expect(str).toContain("{amount}");
    }
  });

  it("does NOT contain the old broken English-only replacement target", () => {
    // The old buggy code did:
    //   t("log.transcriptFailed").replace("Couldn't transcribe...", "Above typical...")
    // Verify the new key is NOT the transcriptFailed key — it's its own key.
    for (const dict of Object.values(DICTS)) {
      expect(dict["log.aboveTypical"]).not.toBe(dict["log.transcriptFailed"]);
    }
  });

  it("placeholder substitution works correctly for each language", () => {
    const testAmount = "₹450";
    for (const dict of Object.values(DICTS)) {
      const raw = dict["log.aboveTypical"];
      const substituted = raw.replace(/\{amount\}/g, testAmount);
      expect(substituted).toContain(testAmount);
      expect(substituted).not.toContain("{amount}");
    }
  });

  it("all 3 translations are meaningfully different (not just copies of English)", () => {
    // A common translation bug is to copy the English string into hi/kn.
    // These 3 should be in their own scripts.
    expect(hi["log.aboveTypical"]).not.toBe(en["log.aboveTypical"]);
    expect(kn["log.aboveTypical"]).not.toBe(en["log.aboveTypical"]);
    expect(hi["log.aboveTypical"]).not.toBe(kn["log.aboveTypical"]);
  });
});

describe("i18n key consistency", () => {
  // Verify all 3 language files have the same set of keys — no missing translations.
  const enKeys = Object.keys(en).sort();
  const hiKeys = Object.keys(hi).sort();
  const knKeys = Object.keys(kn).sort();

  it("Hindi has all keys that English has", () => {
    for (const key of enKeys) {
      expect(hiKeys).toContain(key);
    }
  });

  it("Kannada has all keys that English has", () => {
    for (const key of enKeys) {
      expect(knKeys).toContain(key);
    }
  });

  it("no language has extra keys that English doesn't have", () => {
    for (const key of hiKeys) {
      expect(enKeys).toContain(key);
    }
    for (const key of knKeys) {
      expect(enKeys).toContain(key);
    }
  });
});
