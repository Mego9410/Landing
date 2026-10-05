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
} as const;

export type IconName = keyof typeof ICONS;

export function Icon({ name, size = 22, color, strokeWidth = 2 }: { name: IconName; size?: number; color: string; strokeWidth?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      {ICONS[name]}
    </Svg>
  );
}
