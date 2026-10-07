import { router } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { progress } from "@landing/engine";
import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { Screen } from "@/components/Screen";
import { DraftNote, Header, List, Meter, Options } from "@/components/ui";
import { nextDate, startNextWeek } from "@/state/food";
import { set, useApp } from "@/state/store";
import { space } from "@/theme";
import { MealRow } from "@/components/meals";

/** M7 Plan next week, the week before: start empty or from suggestions, pick each meal, then one shopping list. */
export default function PlanNext() {
  const s = useApp();
  const [start, setStart] = useState<"blank" | "suggested">("blank");
  const nx = s.food.next;
  const head = (
    <View style={{ gap: 6 }}>
      <AppText variant="title" accessibilityRole="header">Plan next week</AppText>
      <AppText color="inkMuted">{nextDate(0)} to {nextDate(6)}. Pick your meals now and we&apos;ll add up everything you need into one shopping list.</AppText>
    </View>
  );
  if (!nx) {
    return (
      <Screen header={<Header fallback="/meals" title="Plan next week" />} contentContainerStyle={{ gap: space[5], paddingBottom: 48 }}>
        {head}
        <Options label="How to start" value={start} onChange={setStart} options={[
          { id: "blank", title: "Pick every meal myself", detail: "Start with an empty week and choose each meal" },
          { id: "suggested", title: "Start from suggestions", detail: "We fill the week for you, then you change what you like" },
        ]} />
        <Button label="Start planning" block onPress={() => set((st) => startNextWeek(st, start))} />
      </Screen>
    );
  }
  const pr = progress(nx.week);
  return (
    <Screen header={<Header fallback="/meals" right={<AppText variant="caption" color="inkMuted">{pr.chosen} of {pr.total} chosen</AppText>} title="Plan next week" />} contentContainerStyle={{ gap: space[5], paddingBottom: 48 }}>
      {head}
      <Meter value={pr.chosen} max={pr.total} label="Meals chosen" />
      {nx.week.days.map((d) => (
        <View key={d.day} style={{ gap: space[2] }}>
          <AppText variant="heading">{d.name} <AppText variant="caption" color="inkMuted">{nextDate(d.day)}</AppText></AppText>
          <List>
            <MealRow first meal={d.breakfast} slot="breakfast" day={d.day} which="next" />
            <MealRow meal={d.lunch} slot="lunch" day={d.day} which="next" />
            <MealRow meal={d.dinner} slot="dinner" day={d.day} which="next" />
            {d.snacks.map((m, i) => <MealRow key={i} index={i} meal={m} slot="snack" day={d.day} which="next" />)}
          </List>
        </View>
      ))}
      <AppText variant="caption" color="inkMuted">Meals you leave empty aren&apos;t on the list. You can change any of these until the week starts.</AppText>
      <Button label="Make my shopping list" icon="basket" block disabled={!pr.chosen} onPress={() => router.push({ pathname: "/meals/shopping", params: { which: "next" } })} />
      <Button label="Start again" variant="quiet" style={{ alignSelf: "center" }} onPress={() => set((st) => { st.food.next = null; })} />
      <DraftNote />
    </Screen>
  );
}
