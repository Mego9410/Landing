import { Pressable, View } from "react-native";
import { SvgXml } from "react-native-svg";
import { CAST, castById } from "@landing/motion";
import { portraitSvg } from "@landing/motion/browser";
import { AppText } from "@/components/AppText";
import { ExerciseAnimation } from "@/components/ExerciseAnimation";
import { Icon } from "@/components/Icon";
import { Screen } from "@/components/Screen";
import { Header, ToggleRow } from "@/components/ui";
import { whoFor } from "@/state/demos";
import { set, useApp } from "@/state/store";
import { radius, space, useColors } from "@/theme";

/** S6b Who shows you the moves: any of the cast, or mix it up. Everyone does the same moves and gets the same cues. */
export default function Demos() {
  const s = useApp(), c = useColors();
  const who = whoFor(s, "preview");
  const pick = (v: string) => set((st) => { st.demos.who = v; });
  return (
    <Screen header={<Header fallback="/settings" title="Exercise demos" />} contentContainerStyle={{ gap: space[5], paddingBottom: 48 }}>
      <AppText variant="title" accessibilityRole="header">Exercise demos</AppText>
      <View style={{ borderRadius: radius.lg, backgroundColor: c.sky, overflow: "hidden" }}>
        <ExerciseAnimation id="squat-2" who={who} paused={s.demos.still} />
        <View style={{ position: "absolute", left: 12, top: 12, backgroundColor: c.surfaceRaised, borderRadius: radius.full, paddingHorizontal: 12, minHeight: 30, paddingVertical: 4, justifyContent: "center" }}>
          <AppText variant="caption" weight="800">{s.demos.who === "mix" ? `Mix it up · today ${castById(who).name}` : `${castById(who).name} · sit to stand`}</AppText>
        </View>
      </View>
      <AppText variant="label" color="inkMuted">WHO SHOWS YOU THE MOVES</AppText>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[2] }}>
        {[{ id: "mix", name: "Mix it up" }, ...CAST.map((m) => ({ id: m.id, name: m.name }))].map((o) => {
          const on = s.demos.who === o.id;
          return (
            <Pressable key={o.id} accessibilityRole="radio" accessibilityState={{ selected: on }} accessibilityLabel={o.name} onPress={() => pick(o.id)}
              style={{ width: "31%", alignItems: "center", gap: 4, padding: 8, borderRadius: radius.md, backgroundColor: on ? c.apricot : c.surfaceRaised }}>
              <View style={{ width: 64, height: 80, borderRadius: radius.sm, backgroundColor: c.sky, overflow: "hidden", alignItems: "center", justifyContent: "center" }}>
                {o.id === "mix" ? <Icon name="shuffle" size={30} color={c.onPastel} /> : <SvgXml xml={portraitSvg(o.id)} width="100%" height="100%" />}
              </View>
              <AppText variant="caption" weight="800" color={on ? "onPastel" : "ink"}>{o.name}</AppText>
            </Pressable>
          );
        })}
      </View>
      <ToggleRow title="Still pictures" sub="Hold the starting position instead of a moving loop" value={s.demos.still} onChange={(v) => set((st) => { st.demos.still = v; })} />
      <AppText variant="caption" color="inkMuted">Changes apply from your next exercise. Everyone does the same moves and gets the same cues.</AppText>
    </Screen>
  );
}
