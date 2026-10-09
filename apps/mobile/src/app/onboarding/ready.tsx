import { router } from "expo-router";
import { today } from "@/data/dates";
import { View } from "react-native";
import { AppText } from "@/components/AppText";
import { Card } from "@/components/Card";
import { Step } from "@/components/Onboarding";
import { habitsForWeek, phaseOf, PHASES } from "@/data/content";
import { refreshReminders } from "@/state/reminders";
import { get, set, useApp, weekOf } from "@/state/store";
import { space } from "@/theme";

/** O12 Your Steadie plan. */
export default function Ready() {
  const s = useApp();
  const week = weekOf(s), phase = phaseOf(week);
  function start() {
    set((st) => {
      st.onboarded = true;
      st.startedOn = today();
      const ids = habitsForWeek(week);
      st.habits = { week, ids, swappedFrom: null };
      st.food.joinedWeek = week; // the fibre ramp starts today
      st.food.plan = null;
    });
    refreshReminders(get()); // the check-in reminder, if turned on, starts tomorrow
    router.replace("/");
  }
  return (
    <Step n={7} title="12 months to make it stick" lede={`Three phases, a few small habits at a time. You're starting in week ${week}.`} next={start} label="Start my plan">
      <View style={{ gap: space[3] }}>
        {PHASES.map((p) => (
          <Card key={p.key} tone={p.tone} style={{ gap: 2, borderWidth: p.key === phase.key ? 2 : 0 }}>
            <AppText weight="800" color="onPastel">{p.name} · weeks {p.from}–{p.to}{p.key === phase.key ? " · you're here" : ""}</AppText>
            <AppText variant="caption" color="onPastel">{p.focus}</AppText>
          </Card>
        ))}
      </View>
      <AppText color="inkMuted">Your first week of meals is ready, built from your answers. Every recipe is a draft until our dietitian checks it.</AppText>
    </Step>
  );
}
