import type { CSSProperties } from "react";

export const backgroundThemeDefaults = {
  backgroundGlow1: "#ff601d",
  backgroundGlow2: "#00e5ff",
  backgroundGlow3: "#ff4d8d",
  backgroundBase1: "#050608",
  backgroundBase2: "#10131b",
  backgroundBase3: "#07080c"
} as const;

export const backgroundThemeKeys = Object.keys(backgroundThemeDefaults) as Array<keyof typeof backgroundThemeDefaults>;

export function normalizeBackgroundColor(raw: string | null | undefined, fallback: string) {
  const value = (raw || "").trim();
  if (/^#[0-9a-fA-F]{6}$/.test(value)) {
    return value.toLowerCase();
  }
  return fallback;
}

export function buildBackgroundCssVars(
  theme?: Partial<Record<keyof typeof backgroundThemeDefaults, string>> | null
): CSSProperties {
  return {
    ["--bg-glow-1" as string]: normalizeBackgroundColor(theme?.backgroundGlow1, backgroundThemeDefaults.backgroundGlow1),
    ["--bg-glow-2" as string]: normalizeBackgroundColor(theme?.backgroundGlow2, backgroundThemeDefaults.backgroundGlow2),
    ["--bg-glow-3" as string]: normalizeBackgroundColor(theme?.backgroundGlow3, backgroundThemeDefaults.backgroundGlow3),
    ["--bg-base-1" as string]: normalizeBackgroundColor(theme?.backgroundBase1, backgroundThemeDefaults.backgroundBase1),
    ["--bg-base-2" as string]: normalizeBackgroundColor(theme?.backgroundBase2, backgroundThemeDefaults.backgroundBase2),
    ["--bg-base-3" as string]: normalizeBackgroundColor(theme?.backgroundBase3, backgroundThemeDefaults.backgroundBase3)
  };
}
