import Svg, { Circle, Path } from "react-native-svg";

// The design system's 2px rounded line icons (packages/design-system/assets/Icons), drawn in the current colour.
const ICONS = {
  today: (
    <>
      <Circle cx="12" cy="12" r="4" />
      <Path d="M12 3v1.5M12 19.5V21M3 12h1.5M19.5 12H21M5.6 5.6l1.1 1.1M17.3 17.3l1.1 1.1M5.6 18.4l1.1-1.1M17.3 6.7l1.1-1.1" />
    </>
  ),
  plan: (
    <>
      <Path d="M6 18.5c0-4 3-5 6-6.5s6-2.5 6-6.5" />
      <Circle cx="6" cy="19" r="1.6" />
      <Circle cx="18" cy="5" r="1.6" />
    </>
  ),
  progress: (
    <>
      <Path d="M4 19.5h16" />
      <Path d="M5 15l4.5-4.5 3.5 3 6-6" />
    </>
  ),
  coach: <Path d="M7 4.5h10a3 3 0 0 1 3 3v5.5a3 3 0 0 1-3 3h-5.5L7.5 19.5V16H7a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3z" />,
  check: <Path d="M5 12.5l4.5 4.5L19 7.5" />,
  plus: <Path d="M12 5v14M5 12h14" />,
  workout: <Path d="M7 8v8M17 8v8M4 10.5v3M20 10.5v3M7 12h10" />,
  chevron: <Path d="M9 5l7 7-7 7" />,
  back: <Path d="M15 5l-7 7 7 7" />,
  close: <Path d="M6 6l12 12M18 6L6 18" />,
  meal: (
    <>
      <Path d="M4 13h16a8 8 0 0 1-16 0z" />
      <Path d="M9 4.5c0 1.5 1 1.5 1 3M13 4.5c0 1.5 1 1.5 1 3" />
    </>
  ),
  basket: (
    <>
      <Path d="M4 9.5h16l-1.6 9a2 2 0 0 1-2 1.5H7.6a2 2 0 0 1-2-1.5z" />
      <Path d="M9 9.5l3-5 3 5" />
    </>
  ),
  shuffle: (
    <>
      <Path d="M4 7h3.5c4.5 0 4.5 10 9 10H20M4 17h3.5c1.6 0 2.6-1.2 3.4-2.8M13.1 9.8C14 8.2 15 7 16.5 7H20" />
      <Path d="M17.5 4.5L20 7l-2.5 2.5M17.5 14.5L20 17l-2.5 2.5" />
    </>
  ),
  doc: (
    <>
      <Path d="M7 3.5h7l4 4v13H7z" />
      <Path d="M14 3.5v4h4" />
    </>
  ),
  pause: <Path d="M9 6v12M15 6v12" />,
  play: <Path d="M8 5.5v13l10-6.5z" />,
  send: <Path d="M12 19V5M6 11l6-6 6 6" />,
  minus: <Path d="M5 12h14" />,
  settings: (
    <>
      <Circle cx="12" cy="12" r="3" />
      <Path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8" />
    </>
  ),
} as const;

export type IconName = keyof typeof ICONS;

export function Icon({ name, size = 22, color, strokeWidth = 2 }: { name: IconName; size?: number; color: string; strokeWidth?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      {ICONS[name]}
    </Svg>
  );
}
