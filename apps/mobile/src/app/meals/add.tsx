import { router, useLocalSearchParams } from "expo-router";
import { replaceMeal } from "@landing/engine";
import { AppText } from "@/components/AppText";
import { Screen } from "@/components/Screen";
import { Header, List, Row } from "@/components/ui";
import { mealAt, profileOf, px, saveThisWeek, SLOT_NAME, thisWeek } from "@/state/food";
import { set, useApp } from "@/state/store";
import { toast } from "@/state/toast";
import { space } from "@/theme";

/** M6 Add a recipe to a day this week. */
export default function AddMeal() {
  const s = useApp();
  const { id } = useLocalSearchParams<{ id: string }>();
  const x = px(s, id), slot = x.recipe.slot, week = thisWeek(s);
  return (
    <Screen contentContainerStyle={{ gap: space[4], paddingBottom: 48 }}>
      <Header close fallback="/meals" />
      <AppText variant="title">Which day?</AppText>
      <AppText color="inkMuted">{x.name} replaces that day&apos;s {SLOT_NAME[slot].toLowerCase()}.</AppText>
      <List>
        {week.days.map((d, i) => {
          const m = mealAt(week, i, slot);
          const now = m?.recipe ? px(s, m.recipe).name : m?.kind === "takeaway" ? "Takeaway night" : "Nothing planned";
          return <Row key={i} first={i === 0} title={d.name} sub={now} onPress={() => {
            set((st) => saveThisWeek(st, replaceMeal(thisWeek(st), profileOf(st), i, slot, id)));
            toast(`${x.name} is on for ${d.name}. Your shopping list is updated.`);
            router.back();
          }} />;
        })}
      </List>
    </Screen>
  );
}
