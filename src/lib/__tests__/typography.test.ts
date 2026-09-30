import {
  uiFont,
  numericFont,
  hindiFont,
  kannadaFont,
  weightSuffix,
  text,
  TYPE_SCALE,
  type FontWeight,
} from "@/lib/typography";

describe("typography", () => {
  describe("weightSuffix", () => {
    it("returns Regular for 400", () => {
      expect(weightSuffix("400")).toBe("Regular");
    });
    it("returns Medium for 500", () => {
      expect(weightSuffix("500")).toBe("Medium");
    });
    it("returns SemiBold for 600", () => {
      expect(weightSuffix("600")).toBe("SemiBold");
    });
    it("returns Bold for 700", () => {
      expect(weightSuffix("700")).toBe("Bold");
    });
    it("returns ExtraBold for 800", () => {
      expect(weightSuffix("800")).toBe("ExtraBold");
    });
  });

  describe("uiFont", () => {
    it("returns Onest family with weight suffix", () => {
      expect(uiFont("400")).toBe("Onest-Regular");
      expect(uiFont("700")).toBe("Onest-Bold");
    });

    it("defaults to 400 weight", () => {
      expect(uiFont()).toBe("Onest-Regular");
    });
  });

  describe("numericFont", () => {
    it("returns Inter family with weight suffix", () => {
      expect(numericFont("600")).toBe("Inter-SemiBold");
      expect(numericFont("800")).toBe("Inter-ExtraBold");
    });

    it("defaults to 600 weight (semibold for numerics)", () => {
      expect(numericFont()).toBe("Inter-SemiBold");
    });
  });

  describe("hindiFont", () => {
    it("returns NotoSansDevanagari family with weight suffix", () => {
      expect(hindiFont("700")).toBe("NotoSansDevanagari-Bold");
    });
  });

  describe("kannadaFont", () => {
    it("returns NotoSansKannada family with weight suffix", () => {
      expect(kannadaFont("600")).toBe("NotoSansKannada-SemiBold");
    });
  });

  describe("text helper", () => {
    it("returns ui family object", () => {
      const t = text("ui", "700");
      expect(t.fontFamily).toBe("Onest-Bold");
    });

    it("returns numeric family object", () => {
      const t = text("numeric", "700");
      expect(t.fontFamily).toBe("Inter-Bold");
    });

    it("returns hindi family object", () => {
      const t = text("hindi", "400");
      expect(t.fontFamily).toBe("NotoSansDevanagari-Regular");
    });

    it("returns kannada family object", () => {
      const t = text("kannada", "400");
      expect(t.fontFamily).toBe("NotoSansKannada-Regular");
    });
  });

  describe("TYPE_SCALE", () => {
    it("has all expected sizes", () => {
      const sizes = Object.keys(TYPE_SCALE);
      expect(sizes).toEqual(
        expect.arrayContaining([
          "display",
          "h1",
          "h2",
          "h3",
          "body",
          "bodySmall",
          "caption",
          "micro",
        ]),
      );
    });

    it("each size has size + lineHeight", () => {
      for (const key of Object.keys(TYPE_SCALE)) {
        const scale = TYPE_SCALE[key as keyof typeof TYPE_SCALE];
        expect(scale.size).toBeGreaterThan(0);
        expect(scale.lineHeight).toBeGreaterThan(scale.size);
      }
    });

    it("sizes increase as we go up the scale", () => {
      expect(TYPE_SCALE.micro.size).toBeLessThan(TYPE_SCALE.body.size);
      expect(TYPE_SCALE.body.size).toBeLessThan(TYPE_SCALE.h1.size);
      expect(TYPE_SCALE.h1.size).toBeLessThan(TYPE_SCALE.display.size);
    });
  });

  describe("FontWeight coverage", () => {
    it("all weights 400-800 supported", () => {
      const weights: FontWeight[] = ["400", "500", "600", "700", "800"];
      for (const w of weights) {
        expect(uiFont(w)).toBeTruthy();
        expect(numericFont(w)).toBeTruthy();
        expect(hindiFont(w)).toBeTruthy();
        expect(kannadaFont(w)).toBeTruthy();
      }
    });
  });
});
