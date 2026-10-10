import { router } from "expo-router";
import { useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { OnbScreen, Opt, Title } from "@/components/Onboarding";
import { today } from "@/data/dates";
import { kgFromStLb } from "@/data/units";
import { set, useApp, type Story, type Units } from "@/state/store";
import { radius, space, textStyle, useColors } from "@/theme";

const VIEWS: { id: Story["weightView"]; label: string }[] = [{ id: "show", label: "Show it" }, { id: "trend", label: "Just show the trend" }, { id: "hide", label: "Not at all" }];

/** 12 · Numbers, your way: whether weight shows at all (not at all is Habit Only mode), and, optionally, today's weight and the
 *  lowest on the jab (the steady zone starts from it). Pregnancy keeps weight hidden. */
export default function Numbers() {
  const s = useApp(), c = useColors();
  const pregnant = !!s.health.answers.pregnant;
  const [view, setView] = useState<Story["weightView"]>(pregnant ? "hide" : s.settings.safeMode ? "hide" : s.story.weightView);
  const [units, setUnits] = useState<Units>(s.settings.units);
  const [vals, setVals] = useState({ kg: "", st: "", lb: "", lowKg: "", lowSt: "", lowLb: "" });
  const [error, setError] = useState("");

  function weightOf(kg: string, st: string, lb: string): number | null | "bad" {
    const read = (v: string) => (v.trim() === "" ? null : parseFloat(v.replace(",", ".")));
    const w = units === "kg" ? read(kg) : st.trim() === "" && lb.trim() === "" ? null : kgFromStLb(read(st) ?? 0, read(lb) ?? 0);
    if (w == null) return null;
    return w >= 30 && w <= 300 ? Math.round(w * 10) / 10 : "bad";
  }
  function next() {
    const now = view === "hide" ? null : weightOf(vals.kg, vals.st, vals.lb);
    const low = view === "hide" ? null : weightOf(vals.lowKg, vals.lowSt, vals.lowLb);
    if (now === "bad" || low === "bad") { setError("That weight doesn’t look right. Check the number, or leave it blank."); return; }
    set((st) => {
      st.story.weightView = view;
      st.settings.safeMode = view === "hide";
      st.settings.units = units;
      if (now != null) { const t = today(); st.weights = [{ date: t, kg: now, source: "Logged by you" }, ...st.weights.filter((x) => x.date !== t)]; }
      if (low != null) st.ob.lowestWeight = low;
    });
    router.push("/onboarding/food-noise");
  }
  const input = (key: keyof typeof vals, label: string, placeholder: string) => (
    <TextInput accessibilityLabel={label} value={vals[key]} onChangeText={(v) => { setError(""); setVals((x) => ({ ...x, [key]: v })); }} keyboardType="decimal-pad" placeholder={placeholder} placeholderTextColor={c.inkMuted}
      style={[textStyle("bodyLg", "700"), { minWidth: 48, color: c.ink, paddingVertical: 8 }]} />
  );
  const field = (label: string, which: "now" | "low") => (
    <View style={{ gap: 6 }}>
      <AppText weight="800" color="inkMuted" style={{ fontSize: 14 }}>{label}</AppText>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6, minHeight: 54, borderRadius: radius.md, borderWidth: 1.5, borderColor: c.line, backgroundColor: c.surfaceRaised, paddingHorizontal: 14 }}>
        {units === "kg" ? <>{input(which === "now" ? "kg" : "lowKg", `${label}, kilograms`, "–")}<AppText weight="800" color="inkMuted">kg</AppText></>
          : <>{input(which === "now" ? "st" : "lowSt", `${label}, stone`, "–")}<AppText weight="800" color="inkMuted">st</AppText>{input(which === "now" ? "lb" : "lowLb", `${label}, pounds`, "–")}<AppText weight="800" color="inkMuted">lb</AppText></>}
      </View>
    </View>
  );
  const unit = (u: Units, label: string) => (
    <Pressable accessibilityRole="radio" accessibilityState={{ selected: units === u }} onPress={() => setUnits(u)}
      style={{ minHeight: 36, justifyContent: "center", paddingHorizontal: 12, borderRadius: radius.full, backgroundColor: units === u ? c.surfaceRaised : "transparent" }}>
      <AppText weight="800" color={units === u ? "ink" : "inkMuted"} style={{ fontSize: 14 }}>{label}</AppText>
    </Pressable>
  );
  return (
    <OnbScreen route="numbers" footer={<>
      {error ? <AppText variant="caption" color="roseInk" style={{ textAlign: "center" }}>{error}</AppText> : null}
      <Button label="Continue" variant="brand" block onPress={next} />
    </>}>
      <Title>Would you like to see your weight in Steadie?</Title>
      <View accessibilityRole="radiogroup" accessibilityLabel="How weight shows" style={{ gap: space[2], marginTop: space[2] }}>
        {VIEWS.map((v) => <Opt key={v.id} label={v.label} on={view === v.id} onPress={() => { if (!pregnant) setView(v.id); }} />)}
      </View>
      {pregnant ? <AppText variant="caption" color="inkMuted">Weight stays hidden while you’re pregnant or recently gave birth.</AppText> : null}
      {view !== "hide" ? (
        <>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: space[3] }}>
            <AppText weight="800" style={{ fontSize: 15 }}>Both optional</AppText>
            <View accessibilityRole="radiogroup" accessibilityLabel="Units" style={{ flexDirection: "row", backgroundColor: c.surfaceSunk, borderRadius: radius.full, padding: 3 }}>{unit("stlb", "st & lb")}{unit("kg", "kg")}</View>
          </View>
          {field("Today", "now")}
          {field("Your lowest on the jab", "low")}
        </>
      ) : (
        <View style={{ flexDirection: "row", gap: space[2], alignItems: "center", marginTop: space[2] }}>
          <Icon name="check" size={18} color={c.sageInk} />
          <AppText color="inkMuted" style={{ flex: 1 }}>Weight and numbers stay hidden (Habit Only mode). Your plan is all routines.</AppText>
        </View>
      )}
      <AppText variant="caption" color="inkMuted" style={{ marginTop: space[2], fontSize: 14, lineHeight: 20 }}>We only use this to notice drift early, gently. You can change any of this in Settings.</AppText>
    </OnbScreen>
  );
}
