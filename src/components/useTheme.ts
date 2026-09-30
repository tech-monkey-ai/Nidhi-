// NIDHI — Theme hook (light/dark via useColorScheme)

import { useColorScheme } from "react-native";
import { COLORS, ELEVATION, MOTION, SPACING, RADII, type Theme } from "@/lib/theme";

export interface ThemeBundle {
  theme: Theme;
  colors: (typeof COLORS)[Theme];
  elevation: typeof ELEVATION;
  motion: typeof MOTION;
  spacing: typeof SPACING;
  radii: typeof RADII;
}

export function useTheme(): ThemeBundle {
  const scheme = useColorScheme();
  const theme: Theme = scheme === "dark" ? "dark" : "light";
  return {
    theme,
    colors: COLORS[theme],
    elevation: ELEVATION,
    motion: MOTION,
    spacing: SPACING,
    radii: RADII,
  };
}

export { COLORS, ELEVATION, MOTION, SPACING, RADII };
