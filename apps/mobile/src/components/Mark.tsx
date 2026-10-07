import Svg, { Circle, G, Path, Rect } from "react-native-svg";
import { useColorScheme } from "react-native";

// The Steadie mark, the "roly-poly" (packages/design-system/assets/Logos): a self-righting shape leaning 12° left, its
// weight dot low down, on a ground line. The dot is a knock-out, so pass the colour behind the mark as `hole`.
const BODY = "M50 24 C66 24 74 44 74 59 C74 72 63 80 50 80 C37 80 26 72 26 59 C26 44 34 24 50 24 Z";

/** `height` in points; the width follows (56:76). Apricot on light, apricot-soft in dark mode, unless `color` is set. */
export function Mark({ height, hole, color, ground = true }: { height: number; hole: string; color?: string; ground?: boolean }) {
  const dark = useColorScheme() === "dark";
  const fill = color ?? (dark ? "#F2A27A" : "#DE6F44");
  return (
    <Svg width={(height * 56) / 76} height={height} viewBox="22 18 56 76" accessible={false}>
      <G transform="rotate(-12 50 80)">
        <Path d={BODY} fill={fill} />
        <Circle cx={50} cy={64} r={7} fill={hole} />
      </G>
      {ground ? <Rect x={31} y={85} width={38} height={5} rx={2.5} fill={fill} opacity={0.5} /> : null}
    </Svg>
  );
}
