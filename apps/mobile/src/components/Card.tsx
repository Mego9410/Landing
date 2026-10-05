import { View, type ViewProps } from "react-native";
import { radius, space, useColors } from "@/theme";

type Tone = "raised" | "sunk" | "apricot" | "sage" | "lilac" | "sky" | "butter";

/** The basic container: raised on the oat surface, or a pastel tone for a card with a job. */
export function Card({ tone = "raised", hero, style, ...rest }: ViewProps & { tone?: Tone; hero?: boolean }) {
  const c = useColors();
  const bg = tone === "raised" ? c.surfaceRaised : tone === "sunk" ? c.surfaceSunk : c[tone];
  return (
    <View
      {...rest}
      style={[
        { backgroundColor: bg, borderRadius: radius.lg, padding: hero ? space[5] : space[4], gap: space[2] },
        tone === "raised" && { shadowColor: "#6b4a30", shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
        style,
      ]}
    />
  );
}
