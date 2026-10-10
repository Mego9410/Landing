import { router } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";
import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Screen } from "@/components/Screen";
import { Header } from "@/components/ui";
import { habitsForWeek } from "@/data/content";
import { describe } from "@/state/journal";
import { lookBack } from "@/state/plans";
import { jabWeek, set, useApp } from "@/state/store";
import { toast } from "@/state/toast";
import { space } from "@/theme";

/** Your month: a short look back at the last four weeks on the plan, offered on Today every four weeks. No weight in
 *  Habit Only mode, and nothing framed as a target. */
export default function LookBack() {
  const s = useApp(), r = lookBack(s);
  // Opening it counts as seeing this month's card.
  useEffect(() => { if (r.month >= 1 && (s.lookBackSeen ?? 0) < r.month) set((st) => { st.lookBackSeen = r.month; }); }, [r.month, s.lookBackSeen]);
  const ownable = habitsForWeek(jabWeek(s))[0] === "ownRoutine";
  const scored = r.scores.filter((x): x is number => x != null);
  return (
    <Screen header={<Header fallback="/" title="Your month" />} contentContainerStyle={{ gap: space[5], paddingBottom: 48 }}>
      <View style={{ gap: 6 }}>
        <AppText variant="label" color="apricotInk">{r.month >= 1 ? `MONTH ${r.month} ON THE PLAN` : "THE LAST FOUR WEEKS"}</AppText>
        <AppText variant="title" accessibilityRole="header">Your month</AppText>
        <AppText color="inkMuted">A quick look back at the last four weeks. Whatever it shows, it&apos;s useful to know.</AppText>
      </View>

      <Card style={{ gap: space[3] }}>
        <Line label="Morning check-ins" value={r.checkIns ? `${r.checkIns} of 28 days` : "None this month, and that's fine"} />
        <Line label="Strength sessions" value={r.sessions ? `${r.sessions} done` : "None this month. Even one next week helps"} />
        <Line label="The habit you kept most" value={r.kept ? `${r.kept.label}, on ${r.kept.days} ${r.kept.days === 1 ? "day" : "days"}` : "Nothing ticked yet. Pick one small habit to start with"} />
        {scored.length ? <Line label="Steady scores, week by week" value={r.scores.map((x) => (x == null ? "–" : String(x))).join(" · ")} /> : null}
      </Card>

      {r.pattern?.lead ? (
        <Card tone="sky" style={{ gap: 4 }}>
          <AppText variant="label" color="onPastel">THE CLEAREST PATTERN SO FAR</AppText>
          <AppText weight="800" color="onPastel">Days with {r.pattern.q.short}: {describe(r.pattern.lead).toLowerCase()}</AppText>
          <AppText variant="caption" color="onPastel">From your check-ins. Patterns, not rules.</AppText>
        </Card>
      ) : null}

      <View style={{ gap: space[3] }}>
        <AppText variant="heading">Keep, change or swap?</AppText>
        <AppText color="inkMuted">Your habits are there to help. If one isn&apos;t, it&apos;s fine to change it.</AppText>
        <Button label="Keep them as they are" block onPress={() => { toast("Lovely. Same again this month."); router.back(); }} />
        <Button label="Swap a habit" variant="secondary" block onPress={() => router.push({ pathname: "/swap-habit", params: ownable ? { which: "own" } : {} })} />
        <Button label="Change reminders" variant="quiet" onPress={() => router.push("/settings/reminders")} style={{ alignSelf: "center" }} />
      </View>
    </Screen>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ gap: 2 }}>
      <AppText variant="caption" color="inkMuted">{label}</AppText>
      <AppText weight="800">{value}</AppText>
    </View>
  );
}
