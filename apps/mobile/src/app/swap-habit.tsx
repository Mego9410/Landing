import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Screen } from "@/components/Screen";
import { Choices, Header, Options } from "@/components/ui";
import { HABIT_SWAPS, HABITS, habitsForWeek, OWN_HABITS } from "@/data/content";
import { habitsNow, jabWeek, set, useApp } from "@/state/store";
import { toast } from "@/state/toast";
import { space } from "@/theme";

/** T3 Swap the week's third habit for another, this week only. In Steady and year two, also choose which habit from
 *  earlier in the year takes the place of "Your own routine", for good. `which=own` opens on that. */
export default function SwapHabit() {
  const s = useApp(), params = useLocalSearchParams<{ which?: string }>();
  const ownable = habitsForWeek(jabWeek(s))[0] === "ownRoutine";
  const [which, setWhich] = useState<"week" | "own">(ownable && params.which === "own" ? "own" : "week");
  const replacing = s.habits.ids[2];
  const options = HABIT_SWAPS.filter((o) => !s.habits.ids.includes(o.id));
  const [pick, setPick] = useState(options[0]?.id ?? "walk");
  const ownOptions = [
    { id: "ownRoutine", title: HABITS.ownRoutine.label, detail: "Keep it open: the habits that stuck, your way" },
    ...OWN_HABITS.map((id) => ({ id, title: HABITS[id].label, detail: HABITS[id].note })),
  ];
  const [own, setOwn] = useState(s.ownHabit ?? "ownRoutine");
  return (
    <Screen header={<Header close fallback="/" title="Swap a habit" />} contentContainerStyle={{ gap: space[5], paddingBottom: 48 }}>
      <AppText variant="title">Swap a habit</AppText>
      {ownable ? <Choices label="Which habit" value={which} onChange={(v) => setWhich(v as "week" | "own")}
        options={[{ id: "week", label: "This week's habit" }, { id: "own", label: "Your own routine" }]} /> : null}
      {which === "own" ? (
        <>
          <AppText color="inkMuted">Pick a habit from earlier in the year that you&apos;d like to keep. It stays until you change it.</AppText>
          <Options label="Your own routine" value={own} onChange={setOwn} options={ownOptions} />
          <Button label="Make it mine" block onPress={() => {
            set((st) => {
              st.ownHabit = own === "ownRoutine" ? null : own;
              const now = habitsNow(st);
              st.habits.ids[0] = now.ids[0];
              if (st.habits.ids[2] === now.ids[0]) st.habits.ids[2] = now.ids[2];
            });
            toast(own === "ownRoutine" ? "Kept open: your own routine." : `Your own routine is now: ${HABITS[own].label}.`);
            router.back();
          }} />
        </>
      ) : (
        <>
          {replacing ? (
            <Card tone="sunk" style={{ gap: 2 }}>
              <AppText variant="caption" color="inkMuted">Replacing, for this week only</AppText>
              <AppText weight="800">{HABITS[replacing].label}</AppText>
            </Card>
          ) : null}
          <Options label="Swap options" value={pick} onChange={setPick} options={options} />
          <Button label="Choose this one" block onPress={() => {
            set((st) => { const old = st.habits.ids[2]; st.habits.swappedFrom = st.habits.swappedFrom ?? old; st.habits.ids[2] = pick; });
            toast(`Swapped for this week: ${HABITS[pick].label}.`);
            router.back();
          }} />
        </>
      )}
    </Screen>
  );
}
