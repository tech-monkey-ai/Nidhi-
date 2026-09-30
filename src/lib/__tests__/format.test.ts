import {
  formatCurrency,
  formatNumber,
  formatPercent,
  formatDate,
  greetingKey,
  isSameDay,
  isToday,
  isSameWeek,
  isSameMonth,
  parseAmount,
  addMonths,
} from "@/lib/format";

// Helper: build a local-time ISO string for a given y/m/d (no Z suffix, so
// JS Date treats it as local time on every machine — no timezone-dependent
// test failures like the original `Z`-suffixed UTC strings).
function localIso(y: number, m: number, d: number, h = 10): string {
  const mm = String(m).padStart(2, "0");
  const dd = String(d).padStart(2, "0");
  const hh = String(h).padStart(2, "0");
  return `${y}-${mm}-${dd}T${hh}:00:00`;
}

describe("format", () => {
  describe("formatCurrency", () => {
    it("formats a simple amount", () => {
      expect(formatCurrency(500)).toBe("₹500");
    });

    it("formats with Indian grouping (lakh)", () => {
      expect(formatCurrency(150000)).toBe("₹1,50,000");
    });

    it("formats with Indian grouping (crore)", () => {
      expect(formatCurrency(10000000)).toBe("₹1,00,00,000");
    });

    it("rounds decimal to nearest rupee", () => {
      expect(formatCurrency(99.99)).toBe("₹100");
      expect(formatCurrency(99.4)).toBe("₹99");
    });

    it("handles negative amounts", () => {
      expect(formatCurrency(-500)).toBe("-₹500");
    });

    it("handles zero", () => {
      expect(formatCurrency(0)).toBe("₹0");
    });

    it("respects language param (no crash)", () => {
      expect(formatCurrency(1000, "hi")).toBe("₹1,000");
      expect(formatCurrency(1000, "kn")).toBe("₹1,000");
    });
  });

  describe("formatNumber", () => {
    it("formats with Indian grouping", () => {
      expect(formatNumber(125000)).toBe("1,25,000");
    });
  });

  describe("formatPercent", () => {
    it("rounds to nearest integer", () => {
      expect(formatPercent(45.6)).toBe("46%");
      expect(formatPercent(45.4)).toBe("45%");
    });
  });

  describe("greetingKey", () => {
    it("returns a valid greeting key based on current hour", () => {
      const k = greetingKey();
      expect(["morning", "afternoon", "evening"]).toContain(k);
    });

    it("returns morning at 8am", () => {
      const realDate = Date;
      const mock = new Date("2024-01-01T08:00:00");
      const spy = jest.spyOn(global, "Date").mockImplementation(((...args: unknown[]) =>
        args.length ? new (realDate as any)(...args) : mock) as any);
      expect(greetingKey()).toBe("morning");
      spy.mockRestore();
    });

    it("returns evening at 8pm", () => {
      const realDate = Date;
      const mock = new Date("2024-01-01T20:00:00");
      const spy = jest.spyOn(global, "Date").mockImplementation(((...args: unknown[]) =>
        args.length ? new (realDate as any)(...args) : mock) as any);
      expect(greetingKey()).toBe("evening");
      spy.mockRestore();
    });
  });

  describe("isSameDay", () => {
    it("returns true for same day (different times)", () => {
      const a = localIso(2024, 3, 15, 10);
      const b = localIso(2024, 3, 15, 22);
      expect(isSameDay(a, b)).toBe(true);
    });

    it("returns false for different days", () => {
      const a = localIso(2024, 3, 15, 10);
      const b = localIso(2024, 3, 16, 10);
      expect(isSameDay(a, b)).toBe(false);
    });

    it("returns false across months", () => {
      const a = localIso(2024, 3, 31, 22);
      const b = localIso(2024, 4, 1, 1);
      expect(isSameDay(a, b)).toBe(false);
    });

    it("returns false across years", () => {
      const a = localIso(2023, 12, 31, 22);
      const b = localIso(2024, 1, 1, 1);
      expect(isSameDay(a, b)).toBe(false);
    });
  });

  describe("isToday", () => {
    it("returns true for the current moment", () => {
      expect(isToday(new Date().toISOString())).toBe(true);
    });

    it("returns false for a year ago", () => {
      const lastYear = new Date();
      lastYear.setFullYear(lastYear.getFullYear() - 1);
      expect(isToday(lastYear.toISOString())).toBe(false);
    });
  });

  describe("parseAmount", () => {
    it("parses clean numeric", () => {
      expect(parseAmount("500")).toBe(500);
    });

    it("parses Indian-formatted amount", () => {
      expect(parseAmount("1,00,000")).toBe(100000);
    });

    it("parses currency-prefixed amount", () => {
      expect(parseAmount("₹1,500")).toBe(1500);
    });

    it("returns NaN for empty", () => {
      expect(parseAmount("")).toBeNaN();
    });

    it("returns NaN for non-numeric", () => {
      expect(parseAmount("abc")).toBeNaN();
    });
  });

  describe("addMonths", () => {
    it("adds months correctly within a year", () => {
      const base = localIso(2024, 1, 15);
      const result = addMonths(base, 3);
      expect(new Date(result).getMonth()).toBe(3); // April (0-indexed)
    });

    it("adds months across year boundary", () => {
      const base = localIso(2024, 11, 15);
      const result = addMonths(base, 3);
      expect(new Date(result).getMonth()).toBe(1); // February
      expect(new Date(result).getFullYear()).toBe(2025);
    });
  });

  describe("isSameWeek", () => {
    it("returns true for two days in same week", () => {
      const a = localIso(2024, 3, 13); // Wednesday
      const b = localIso(2024, 3, 15); // Friday
      expect(isSameWeek(a, b)).toBe(true);
    });

    it("returns false for two days in different weeks", () => {
      const a = localIso(2024, 3, 10); // Sunday (week starts Sunday)
      const b = localIso(2024, 3, 18); // Following Monday
      expect(isSameWeek(a, b)).toBe(false);
    });
  });

  describe("isSameMonth", () => {
    it("returns true for two days in same month", () => {
      const a = localIso(2024, 3, 1);
      const b = localIso(2024, 3, 31);
      expect(isSameMonth(a, b)).toBe(true);
    });

    it("returns false across months", () => {
      const a = localIso(2024, 3, 31);
      const b = localIso(2024, 4, 1);
      expect(isSameMonth(a, b)).toBe(false);
    });
  });

  describe("formatDate", () => {
    it("formats a date in English-Indian locale", () => {
      const out = formatDate(localIso(2024, 3, 15));
      expect(out).toContain("2024");
      expect(typeof out).toBe("string");
    });
  });
});
