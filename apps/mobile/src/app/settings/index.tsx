import { router } from "expo-router";
import { View } from "react-native";
import { LABELS } from "@landing/engine";
import { castById } from "@landing/motion";
import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { Screen } from "@/components/Screen";
import { Choices, Header, List, Row, Section, ToggleRow } from "@/components/ui";
import { phaseOf } from "@/data/content";
import { fmt } from "@/data/dates";
import { demoState, freshState, replace, set, setWeek, useApp, weekOf } from "@/state/store";
import { toast } from "@/state/toast";
import { space } from "@/theme";

/** S1 Settings, with the demo controls the prototype keeps in its test panel. */
export default function Settings() {
  const s = useApp();
  const week = weekOf(s);
  return (
    <Screen contentContainerStyle={{ gap: space[6], paddingBottom: 48 }}>
      <Header fallback="/" />
      <AppText variant="title" accessibilityRole="header">Settings</AppText>
      <Section title="YOUR PLAN">
        <List>
          <Row first title={s.name} sub={`Week ${week} · ${phaseOf(week).name}`} />
          <Row title="Food preferences" value={LABELS.diet[s.food.diet]} onPress={() => router.push("/meals/preferences")} />
          <Row title="Exercise demos" value={s.demos.who === "mix" ? "Mix it up" : castById(s.demos.who).name} onPress={() => router.push("/settings/demos")} />
        </List>
      </Section>
      <Section title="SUPPORT">
        <View style={{ gap: space[3] }}>
          <List>
            <Row first title="Health and safety" sub={s.disclaimer ? `You accepted this on ${fmt.dayMonth(s.disclaimer.acceptedAt.slice(0, 10))}` : undefined} onPress={() => router.push({ pathname: "/disclaimer", params: { review: "1" } })} />
          </List>
          <ToggleRow title="Safe mode" sub="Hides weight and numbers, and keeps the focus on routines" value={s.settings.safeMode} onChange={(v) => { set((st) => { st.settings.safeMode = v; }); toast(v ? "Safe mode is on." : "Safe mode is off."); }} />
          <AppText variant="caption" color="inkMuted">If food or eating feels hard, Beat&apos;s helpline is there to talk to.</AppText>
        </View>
      </Section>
      <Section title="DEMO">
        <View style={{ gap: space[3] }}>
          <AppText variant="caption" color="inkMuted">Preview controls. Today is fixed at Monday 5 October 2026, so the dummy data lines up.</AppText>
          <AppText weight="700">Week of the plan</AppText>
          <Choices label="Week" value={week} onChange={(v) => { set((st) => { setWeek(st, v as number); st.food.plan = null; st.food.next = null; }); }}
            options={[1, 6, 9, 27].map((w) => ({ id: w, label: w === 9 ? "Week 9 (Settle)" : w === 27 ? "Week 27 (Steady)" : `Week ${w}` }))} />
          <Button label="Start onboarding again" variant="secondary" block onPress={() => { replace(freshState()); router.replace("/onboarding"); }} />
          <Button label="Reset to Hannah, week 6" variant="quiet" onPress={() => { replace(demoState()); toast("Back to Hannah in week 6."); router.dismissTo("/"); }} style={{ alignSelf: "center" }} />
        </View>
      </Section>
      <AppText variant="caption" color="inkMuted" style={{ textAlign: "center" }}>Landing 1.0 · preview. Recipes and nutrition are drafts until our dietitian signs them off.</AppText>
    </Screen>
  );
}
