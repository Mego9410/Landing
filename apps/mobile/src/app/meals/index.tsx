import { router } from "expo-router";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { dayTotals, LABELS, targets, weekSummary } from "@landing/engine";
import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Chip } from "@/components/Chip";
import { Screen } from "@/components/Screen";
import { Banner, DraftNote, Header, List } from "@/components/ui";
import { today as dateToday, weekdayIndex } from "@/data/dates";
import { profileOf, thisWeek } from "@/state/food";
import { set, stageLabel, useApp } from "@/state/store";
import { toast } from "@/state/toast";
import { radius, space, useColors } from "@/theme";
import { FreeNightCard, MealRow, TakeawayCard } from "@/components/meals";

const GOAL_LINE = { steady: "to help you hold steady", strength: "to help you build strength", fuller: "to help you feel fuller for longer" };
const PHASE_NAME = { land: "Land", settle: "Settle", steady: "Steady" };

/** M1 This week's meals, day by day. */
export default function Meals() {
  const s = useApp(), c = useColors();
  const p = profileOf(s), t = targets(p), week = thisWeek(s), safe = s.settings.safeMode;
  const [day, setDay] = useState(() => weekdayIndex(dateToday()));
  const today = week.days[day], tot = dayTotals(today, p), sum = weekSummary(week, p);
  const cooks = week.days.filter((d) => d.dinner.kind === "cook").length;
  const isToday = day === weekdayIndex(dateToday());
  return (
    <Screen header={<Header fallback="/plan" middle={<Chip label={`${stageLabel(s)} · ${PHASE_NAME[t.phase]}`} tone="apricot" />} title="This week's meals" />} contentContainerStyle={{ gap: space[5] }}>
      <View style={{ gap: 6 }}>
        <AppText variant="title" accessibilityRole="header">This week&apos;s meals</AppText>
        <AppText color="inkMuted">{cooks} dinners to cook, leftovers, a takeaway night and a free night. Planned {GOAL_LINE[p.goal]}.</AppText>
      </View>
      <Card tone="sage" style={{ gap: 8 }}>
        <AppText variant="label" color="onPastel">THIS WEEK&apos;S AIM</AppText>
        <AppText variant="bodyLg" color="onPastel">
          {safe ? "Protein at every meal, a little more fibre each week, and plenty to drink."
            : `About ${t.protein.lunch} g of protein a meal. Fibre: about ${t.fibreDay} g a day${t.fibreDay < t.fibreGoal ? `, building to ${t.fibreGoal} g` : ""}.`}
        </AppText>
        {t.notes[0] ? <AppText variant="caption" color="onPastel">{t.notes[0]}</AppText> : null}
      </Card>

      <View accessibilityRole="tablist" style={{ flexDirection: "row", gap: 4 }}>
        {week.days.map((d, i) => (
          <Pressable key={i} accessibilityRole="tab" accessibilityState={{ selected: i === day }} accessibilityLabel={d.name} onPress={() => setDay(i)}
            style={{ flex: 1, minHeight: 44, borderRadius: radius.full, alignItems: "center", justifyContent: "center", backgroundColor: i === day ? c.apricot : "transparent" }}>
            <AppText weight="700" color={i === day ? "onPastel" : "ink"} style={{ fontSize: 13 }}>{d.name.slice(0, 3)}</AppText>
          </Pressable>
        ))}
      </View>

      <View style={{ gap: 2 }}>
        <AppText variant="heading">{today.name}{isToday ? " · today" : ""}</AppText>
        {safe ? null : <AppText variant="caption" color="inkMuted">Planned meals: about {tot.protein} g protein and {tot.fibre} g fibre</AppText>}
      </View>
      <List>
        <MealRow first meal={today.breakfast} slot="breakfast" day={day} which="this" />
        <MealRow meal={today.lunch} slot="lunch" day={day} which="this" />
        {today.dinner.kind === "cook" || today.dinner.kind === "leftover" ? <MealRow meal={today.dinner} slot="dinner" day={day} which="this" /> : null}
        {today.snacks.map((m, i) => <MealRow key={i} index={i} meal={m} slot="snack" day={day} which="this" />)}
      </List>
      {today.dinner.kind === "takeaway" ? <TakeawayCard /> : null}
      {today.dinner.kind === "free" ? <FreeNightCard day={day} /> : null}
      {sum.notes.map((n) => <Banner key={n}>{n}</Banner>)}

      <View style={{ gap: space[2] }}>
        <Button label="Shopping list" icon="basket" block onPress={() => router.push({ pathname: "/meals/shopping", params: { which: "this" } })} />
        <Button label={s.food.next ? "Next week's meals" : "Plan next week"} variant="secondary" block onPress={() => router.push("/meals/next")} />
        <View style={{ flexDirection: "row", gap: space[2] }}>
          <View style={{ flex: 1 }}>
            <Button label="New week" icon="shuffle" variant="secondary" block onPress={() => { set((st) => { st.food.seed += 1; st.food.plan = null; }); toast("Here's a fresh week. Your preferences stay the same."); }} />
          </View>
          <View style={{ flex: 1 }}>
            <Button label="All recipes" variant="secondary" block onPress={() => router.push("/meals/recipes")} />
          </View>
        </View>
        <Button label={`Food preferences · ${LABELS.diet[p.diet]}`} variant="quiet" onPress={() => router.push("/meals/preferences")} style={{ alignSelf: "center" }} />
      </View>
      <DraftNote />
    </Screen>
  );
}
