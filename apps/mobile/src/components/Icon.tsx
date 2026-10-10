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
  timer: (
    <>
      <Path d="M12 21a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15z" />
      <Path d="M12 9.5v4l2.5 1.5M10 2.5h4M12 2.5V6" />
    </>
  ),
  book: (
    <>
      <Path d="M12 6.5c-1.8-1.3-4.3-2-7.5-2v13c3.2 0 5.7.7 7.5 2 1.8-1.3 4.3-2 7.5-2v-13c-3.2 0-5.7.7-7.5 2z" />
      <Path d="M12 6.5v13" />
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
  heart: <Path d="M12 20.5s-7.5-4.6-7.5-10.4a4.2 4.2 0 0 1 7.5-2.6 4.2 4.2 0 0 1 7.5 2.6c0 5.8-7.5 10.4-7.5 10.4z" />,
  person: (
    <>
      <Circle cx="12" cy="8" r="4" />
      <Path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
    </>
  ),
  lock: (
    <>
      <Path d="M6 11h12v9H6z" />
      <Path d="M8.5 11V8a3.5 3.5 0 0 1 7 0v3" />
    </>
  ),
  bell: <Path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20.5a2 2 0 0 0 4 0" />,
  home: <Path d="M4 11l8-6.5 8 6.5M6.5 9.5V20h11V9.5" />,
  gym: <Path d="M4 21V9l8-5 8 5v12M9 21v-6h6v6" />,
  bolt: <Path d="M13 3L5 13.5h6L10 21l8-10.5h-6z" />,
  smile: (
    <>
      <Circle cx="12" cy="12" r="8.5" />
      <Path d="M8.5 14c1 1.4 2.2 2 3.5 2s2.5-.6 3.5-2M9.5 9.5h.01M14.5 9.5h.01" />
    </>
  ),
  star: <Path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z" />,
  shirt: <Path d="M8 4l-4.5 3 2 4 2-1V20h9V10l2 1 2-4L16 4c-.8 1.5-2.2 2.5-4 2.5S8.8 5.5 8 4z" />,
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
