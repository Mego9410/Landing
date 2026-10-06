import { router } from "expo-router";
import { useState } from "react";
import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Screen } from "@/components/Screen";
import { Header, Options } from "@/components/ui";
import { HABIT_SWAPS, HABITS } from "@/data/content";
import { set, useApp } from "@/state/store";
import { toast } from "@/state/toast";
import { space } from "@/theme";

/** T3 Swap the week's third habit for another, this week only. */
export default function SwapHabit() {
  const s = useApp();
  const replacing = s.habits.ids[2];
  const options = HABIT_SWAPS.filter((o) => !s.habits.ids.includes(o.id));
  const [pick, setPick] = useState(options[0]?.id ?? "walk");
  return (
    <Screen contentContainerStyle={{ gap: space[5], paddingBottom: 48 }}>
      <Header close fallback="/" />
      <AppText variant="title">Swap a habit</AppText>
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
    </Screen>
  );
}
