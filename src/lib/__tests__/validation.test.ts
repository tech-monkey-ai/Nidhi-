import {
  validateAmount,
  validateName,
  validatePhone,
  validateDurationMonths,
  validateLanguage,
  sanitizeText,
} from "@/lib/validation";

describe("validation", () => {
  describe("validateAmount", () => {
    it("accepts a clean numeric string", () => {
      const r = validateAmount("500");
      expect(r.ok).toBe(true);
      expect(r.value).toBe(500);
    });

    it("accepts a numeric input", () => {
      const r = validateAmount(123.45);
      expect(r.ok).toBe(true);
      expect(r.value).toBe(123.45);
    });

    it("strips non-numeric characters", () => {
      const r = validateAmount("₹1,000");
      expect(r.ok).toBe(true);
      expect(r.value).toBe(1000);
    });

    it("rejects NaN", () => {
      const r = validateAmount("abc");
      expect(r.ok).toBe(false);
      expect(r.value).toBeNull();
    });

    it("rejects negative numbers and returns 0", () => {
      const r = validateAmount("-50");
      expect(r.ok).toBe(false);
      expect(r.value).toBe(0);
    });

    it("caps absurdly large values to ₹100 crore", () => {
      const r = validateAmount("99999999999");
      expect(r.ok).toBe(true);
      expect(r.value).toBe(1_00_00_00_000);
    });

    it("rejects empty input", () => {
      const r = validateAmount("");
      expect(r.ok).toBe(false);
    });

    it("rejects Infinity", () => {
      const r = validateAmount(Infinity);
      expect(r.ok).toBe(false);
    });
  });

  describe("validateName", () => {
    it("accepts a valid Latin name", () => {
      const r = validateName("Ramesh Kumar");
      expect(r.ok).toBe(true);
      expect(r.value).toBe("Ramesh Kumar");
    });

    it("accepts Devanagari name", () => {
      const r = validateName("रमेश कुमार");
      expect(r.ok).toBe(true);
      expect(r.value).toBe("रमेश कुमार");
    });

    it("accepts Kannada name", () => {
      const r = validateName("ರಮೇಶ್ ಕುಮಾರ್");
      expect(r.ok).toBe(true);
      expect(r.value).toBe("ರಮೇಶ್ ಕುಮಾರ್");
    });

    it("rejects empty string", () => {
      const r = validateName("");
      expect(r.ok).toBe(false);
    });

    it("rejects names with digits", () => {
      const r = validateName("Ramesh123");
      expect(r.ok).toBe(false);
    });

    it("strips control characters", () => {
      const r = validateName("Ramesh\x00");
      expect(r.ok).toBe(true);
      expect(r.value).toBe("Ramesh");
    });

    it("caps name length to 40", () => {
      const long = "A".repeat(50);
      const r = validateName(long);
      expect(r.ok).toBe(true);
      expect(r.value?.length).toBe(40);
    });
  });

  describe("validatePhone", () => {
    it("accepts Indian mobile (10 digits starting 6-9)", () => {
      const r = validatePhone("9876543210");
      expect(r.ok).toBe(true);
      expect(r.value).toBe("9876543210");
    });

    it("accepts Indian mobile with +91 country code", () => {
      const r = validatePhone("+91 98765 43210");
      expect(r.ok).toBe(true);
      expect(r.value).toBe("919876543210");
    });

    it("accepts international format (7-15 digits)", () => {
      const r = validatePhone("+1 555 123 4567");
      expect(r.ok).toBe(true);
    });

    it("rejects too short", () => {
      const r = validatePhone("12345");
      expect(r.ok).toBe(false);
    });

    it("rejects empty", () => {
      const r = validatePhone("");
      expect(r.ok).toBe(false);
    });
  });

  describe("validateDurationMonths", () => {
    it("accepts positive integer", () => {
      const r = validateDurationMonths(12);
      expect(r.ok).toBe(true);
      expect(r.value).toBe(12);
    });

    it("accepts numeric string", () => {
      const r = validateDurationMonths("6");
      expect(r.ok).toBe(true);
      expect(r.value).toBe(6);
    });

    it("rejects zero", () => {
      const r = validateDurationMonths(0);
      expect(r.ok).toBe(false);
    });

    it("rejects negative", () => {
      const r = validateDurationMonths(-5);
      expect(r.ok).toBe(false);
    });

    it("caps absurd durations to 360 months (30 years)", () => {
      const r = validateDurationMonths(500);
      expect(r.ok).toBe(true);
      expect(r.value).toBe(360);
    });

    it("floors decimal input", () => {
      const r = validateDurationMonths(12.9);
      expect(r.ok).toBe(true);
      expect(r.value).toBe(12);
    });
  });

  describe("validateLanguage", () => {
    it("accepts en", () => expect(validateLanguage("en")).toBe("en"));
    it("accepts hi", () => expect(validateLanguage("hi")).toBe("hi"));
    it("accepts kn", () => expect(validateLanguage("kn")).toBe("kn"));
    it("defaults unknown to en", () => {
      expect(validateLanguage("fr")).toBe("en");
      expect(validateLanguage("")).toBe("en");
      expect(validateLanguage("english")).toBe("en");
    });
  });

  describe("sanitizeText", () => {
    it("strips control characters", () => {
      expect(sanitizeText("Hello\x00World")).toBe("HelloWorld");
    });

    it("trims whitespace", () => {
      expect(sanitizeText("  hello  ")).toBe("hello");
    });

    it("caps length to default 200", () => {
      const long = "x".repeat(250);
      expect(sanitizeText(long).length).toBe(200);
    });

    it("caps to custom max", () => {
      expect(sanitizeText("hello", 3)).toBe("hel");
    });

    it("returns empty string for non-string input", () => {
      expect(sanitizeText(null as unknown as string)).toBe("");
      expect(sanitizeText(undefined as unknown as string)).toBe("");
      expect(sanitizeText(123 as unknown as string)).toBe("");
    });
  });
});
