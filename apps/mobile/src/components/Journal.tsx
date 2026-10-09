import * as Haptics from "expo-haptics";
import { Pressable, View } from "react-native";
import { radius, space, useColors, useLargeText } from "@/theme";
import { AppText } from "./AppText";

const tap = () => Haptics.selectionAsync().catch(() => {});

/** A journal question with Yes and No pills. Tapping the chosen answer again clears it. */
export function YesNo({ ask, detail, value, onChange }: { ask: string; detail?: string; value: boolean | undefined; onChange: (v: boolean | undefined) => void }) {
  const c = useColors(), large = useLargeText();
  return (
    <View style={{ flexDirection: large ? "column" : "row", alignItems: large ? "flex-start" : "center", gap: space[3], paddingVertical: space[3], paddingHorizontal: space[4] }}>
      <View style={{ flex: large ? 0 : 1, gap: 2 }}>
        <AppText weight="700">{ask}</AppText>
        {detail ? <AppText variant="caption" color="inkMuted">{detail}</AppText> : null}
      </View>
      <View accessibilityRole="radiogroup" accessibilityLabel={ask} style={{ flexDirection: "row", gap: space[2] }}>
        {([true, false] as const).map((v) => {
          const on = value === v;
          return (
            <Pressable key={String(v)} accessibilityRole="radio" accessibilityState={{ selected: on }} accessibilityLabel={v ? "Yes" : "No"} accessibilityHint={ask} hitSlop={4}
              onPress={() => { tap(); onChange(on ? undefined : v); }}
              style={{ minWidth: 56, minHeight: 44, paddingHorizontal: space[3], borderRadius: radius.full, alignItems: "center", justifyContent: "center", backgroundColor: on ? c.sky : c.surfaceRaised, borderWidth: on ? 0 : 1.5, borderColor: c.line }}>
              <AppText weight="800" color={on ? "onPastel" : "ink"} style={{ fontSize: 14 }}>{v ? "Yes" : "No"}</AppText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

/** Five round steps, the chosen one filled sky, with words at each end (the design system's HungerScale). */
export function Scale({ ask, low, high, value, onChange }: { ask: string; low: string; high: string; value: number | undefined; onChange: (v: number | undefined) => void }) {
  const c = useColors();
  return (
    <View style={{ gap: space[3] }}>
      <AppText weight="700">{ask}</AppText>
      <View accessibilityRole="radiogroup" accessibilityLabel={ask} style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {[1, 2, 3, 4, 5].map((n) => {
          const on = value === n;
          return (
            <Pressable key={n} accessibilityRole="radio" accessibilityState={{ selected: on }} accessibilityLabel={n === 1 ? `1, ${low}` : n === 5 ? `5, ${high}` : String(n)} accessibilityHint={ask} hitSlop={4}
              onPress={() => { tap(); onChange(on ? undefined : n); }}
              style={{ width: 48, height: 48, borderRadius: radius.full, alignItems: "center", justifyContent: "center", backgroundColor: on ? c.sky : c.surfaceRaised, borderWidth: on ? 0 : 1.5, borderColor: c.line }}>
              <AppText variant="heading" color={on ? "onPastel" : "ink"} maxFontSizeMultiplier={1.3} style={{ fontSize: 18, lineHeight: 22 }}>{n}</AppText>
            </Pressable>
          );
        })}
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <AppText variant="caption" color="inkMuted">{low}</AppText>
        <AppText variant="caption" color="inkMuted">{high}</AppText>
      </View>
    </View>
  );
}
