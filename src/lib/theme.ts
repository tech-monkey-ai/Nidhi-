// NIDHI — Design tokens (v4 — industry-grade mobile-first)
// Designed for 360-414px phone widths. Premium banking-app polish.

export const COLORS = {
  light: {
    background: "#F8F9FA",
    surface: "#FFFFFF",
    surfaceElevated: "#FFFFFF",
    surfaceMuted: "#F1F3F5",
    surfaceGlass: "rgba(255, 255, 255, 0.85)",
    border: "#E9ECEF",
    borderStrong: "#DEE2E6",
    divider: "#F1F3F5",

    textPrimary: "#212529",
    textMuted: "#6C757D",
    textSubtle: "#ADB5BD",
    textInverse: "#FFFFFF",

    primary: "#0F9D58",
    primaryHover: "#0E8E50",
    primarySoft: "#E8F5EE",
    primaryDeep: "#0A7E47",
    primaryGlow: "rgba(15, 157, 88, 0.12)",

    warning: "#F59E0B",
    warningHover: "#D97706",
    warningSoft: "#FEF3C7",
    warningDeep: "#92400E",

    danger: "#DC3545",
    dangerSoft: "#FDE8E8",
    info: "#0EA5E9",
    infoSoft: "#E0F2FE",

    catFood: "#F59E0B",
    catTransport: "#0F9D58",
    catEmi: "#8B5CF6",
    catRent: "#0EA5E9",
    catHealth: "#EC4899",
    catOther: "#64748B",

    overlay: "rgba(0, 0, 0, 0.5)",
    shadowColor: "#000000",
    shadow: "rgba(0, 0, 0, 0.04)",
    shadowStrong: "rgba(0, 0, 0, 0.08)",
    scrim: "rgba(0, 0, 0, 0.6)",
  },
  dark: {
    background: "#0F1115",
    surface: "#1A1D21",
    surfaceElevated: "#22262C",
    surfaceMuted: "#1A1D21",
    surfaceGlass: "rgba(34, 38, 44, 0.85)",
    border: "#2C3036",
    borderStrong: "#3A3F47",
    divider: "#22262C",

    textPrimary: "#F8F9FA",
    textMuted: "#9CA3AF",
    textSubtle: "#6B7280",
    textInverse: "#0F1115",

    primary: "#10B981",
    primaryHover: "#34D399",
    primarySoft: "rgba(16, 185, 129, 0.1)",
    primaryDeep: "#34D399",
    primaryGlow: "rgba(16, 185, 129, 0.2)",

    warning: "#F59E0B",
    warningHover: "#FBBF24",
    warningSoft: "rgba(245, 158, 11, 0.1)",
    warningDeep: "#FBBF24",

    danger: "#EF4444",
    dangerSoft: "rgba(239, 68, 68, 0.1)",
    info: "#38BDF8",
    infoSoft: "rgba(56, 189, 248, 0.1)",

    catFood: "#F59E0B",
    catTransport: "#34D399",
    catEmi: "#A78BFA",
    catRent: "#38BDF8",
    catHealth: "#F472B6",
    catOther: "#94A3B8",

    overlay: "rgba(0, 0, 0, 0.7)",
    shadowColor: "#000000",
    shadow: "rgba(0, 0, 0, 0.3)",
    shadowStrong: "rgba(0, 0, 0, 0.5)",
    scrim: "rgba(0, 0, 0, 0.7)",
  },
} as const;

export type Theme = keyof typeof COLORS;

export const ELEVATION = {
  none: {
    shadowColor: "transparent",
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
  },
  sm: {
    shadowColor: "#000000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  md: {
    shadowColor: "#000000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  lg: {
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  xl: {
    shadowColor: "#000000",
    shadowOpacity: 0.12,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
} as const;

export const MOTION = {
  spring: { damping: 24, stiffness: 300, mass: 0.9 },
  springSoft: { damping: 30, stiffness: 180, mass: 1 },
  springSnappy: { damping: 18, stiffness: 360, mass: 0.8 },
  duration: { fast: 180, base: 280, slow: 400 },
  ease: { out: [0.16, 1, 0.3, 1], inOut: [0.65, 0, 0.35, 1] },
} as const;

export const SPACING = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32, huge: 48,
} as const;

export const RADII = {
  sm: 10, md: 14, lg: 18, xl: 22, xxl: 28, pill: 9999,
} as const;

export const TOUCH_TARGET = 48;
