// Generated from tokens.json by build.mjs. Do not edit by hand.
export const colors = {
  "light": {
    "surface": "#FBF8F4",
    "surfaceRaised": "#FFFFFF",
    "surfaceSunk": "#F3EEE8",
    "line": "#E6DED5",
    "ink": "#2E2A33",
    "inkMuted": "#6A6371",
    "onPastel": "#2E2A33",
    "apricot": "#F8C8AC",
    "apricotInk": "#9E4A20",
    "sage": "#CDE3D2",
    "sageInk": "#2F6142",
    "lilac": "#DDD5F2",
    "lilacInk": "#5A4A8E",
    "sky": "#CCE2EF",
    "skyInk": "#285E7E",
    "butter": "#F6E5AC",
    "butterInk": "#755810",
    "rose": "#F4CFD0",
    "roseInk": "#983538",
    "focus": "#5A4A8E"
  },
  "dark": {
    "surface": "#1F1C23",
    "surfaceRaised": "#2A262F",
    "surfaceSunk": "#18161C",
    "line": "#3B3642",
    "ink": "#F3EEF4",
    "inkMuted": "#B6AEBC",
    "onPastel": "#1F1C23",
    "apricot": "#EBB394",
    "apricotInk": "#F2BEA0",
    "sage": "#A3C7AD",
    "sageInk": "#ADD3B7",
    "lilac": "#BAADE0",
    "lilacInk": "#C7BCEC",
    "sky": "#A3C6DB",
    "skyInk": "#AED0E4",
    "butter": "#E3C97F",
    "butterInk": "#EBD18E",
    "rose": "#E4A9AB",
    "roseInk": "#EFB5B7",
    "focus": "#C7BCEC"
  }
} as const;
export type ThemeName = keyof typeof colors;
export type ColorName = keyof typeof colors.light;
export const space = {
  "1": 4,
  "2": 8,
  "3": 12,
  "4": 16,
  "5": 20,
  "6": 24,
  "8": 32,
  "12": 48
} as const;
export const radius = {
  "sm": 10,
  "md": 16,
  "lg": 24,
  "xl": 32,
  "full": 9999
} as const;
/** Font families by role; the app loads Fredoka and Nunito from @expo-google-fonts. */
export const fontFamilies = {
  "display": "Fredoka",
  "body": "Nunito"
} as const;
export const text = {
  "display": {
    "family": "display",
    "fontSize": 40,
    "lineHeight": 44,
    "fontWeight": "600",
    "letterSpacing": -0.4
  },
  "title": {
    "family": "display",
    "fontSize": 28,
    "lineHeight": 34,
    "fontWeight": "600",
    "letterSpacing": 0
  },
  "heading": {
    "family": "display",
    "fontSize": 20,
    "lineHeight": 26,
    "fontWeight": "500",
    "letterSpacing": 0
  },
  "numeral": {
    "family": "display",
    "fontSize": 56,
    "lineHeight": 56,
    "fontWeight": "600",
    "letterSpacing": -1.12
  },
  "bodyLg": {
    "family": "body",
    "fontSize": 17,
    "lineHeight": 26,
    "fontWeight": "400",
    "letterSpacing": 0
  },
  "body": {
    "family": "body",
    "fontSize": 15,
    "lineHeight": 22,
    "fontWeight": "500",
    "letterSpacing": 0
  },
  "label": {
    "family": "body",
    "fontSize": 13,
    "lineHeight": 18,
    "fontWeight": "700",
    "letterSpacing": 0.26
  },
  "caption": {
    "family": "body",
    "fontSize": 12,
    "lineHeight": 16,
    "fontWeight": "600",
    "letterSpacing": 0
  }
} as const;
export type TextStyleName = keyof typeof text;
