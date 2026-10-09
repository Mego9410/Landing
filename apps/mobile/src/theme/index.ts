import { useColorScheme, useWindowDimensions } from "react-native";
import { colors, fontFamilies, radius, space, text, type TextStyleName } from "@landing/design-system/tokens";

export { radius, space };
export type Colors = { [K in keyof typeof colors.light]: string };

/** The palette for the device's light or dark setting. */
export function useColors(): Colors {
  return useColorScheme() === "dark" ? colors.dark : colors.light;
}

/** True at the larger accessibility text sizes, where side-by-side layouts should stack instead. */
export function useLargeText() {
  return useWindowDimensions().fontScale >= 1.35;
}

// Names the fonts are registered under in app/_layout.tsx.
const FACES: Record<string, Record<string, string>> = {
  Fredoka: { "400": "Fredoka_500Medium", "500": "Fredoka_500Medium", "600": "Fredoka_600SemiBold", "700": "Fredoka_600SemiBold" },
  Nunito: { "400": "Nunito_400Regular", "500": "Nunito_500Medium", "600": "Nunito_600SemiBold", "700": "Nunito_700Bold", "800": "Nunito_800ExtraBold" },
};

/** A design-system text style as a React Native style. React Native picks a weight by font file, so the weight sets the family. */
export function textStyle(name: TextStyleName, weight?: string) {
  const t = text[name];
  const family = fontFamilies[t.family as keyof typeof fontFamilies];
  const w = weight ?? t.fontWeight;
  return {
    fontFamily: FACES[family][w] ?? FACES[family]["500"],
    fontSize: t.fontSize,
    lineHeight: t.lineHeight,
    letterSpacing: t.letterSpacing,
    ...(name === "numeral" ? { fontVariant: ["tabular-nums" as const] } : null),
  };
}
