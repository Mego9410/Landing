import { router } from "expo-router";
import { Pressable, View } from "react-native";
import { progress } from "@landing/engine";
import { AppText } from "@/components/AppText";
import { Card } from "@/components/Card";
import { Screen } from "@/components/Screen";
import { Avatar, Disc, RowCard } from "@/components/ui";
import { PHASES } from "@/data/content";
import { lessonFor } from "@/data/lessons";
import { thisWeek } from "@/state/food";
import { useApp, weekOf } from "@/state/store";
import { radius, space, useColors } from "@/theme";

/** PL1 Your plan: this week, meals this week and next, and the three phases. */
export default function Plan() {
  const s = useApp(), c = useColors();
  const week = weekOf(s), lesson = lessonFor(week);
  const meals = thisWeek(s), cooks = meals.days.filter((d) => d.dinner.kind === "cook").length;
  const nx = s.food.next, pr = nx ? progress(nx.week) : null;
  return (
    <Screen contentContainerStyle={{ gap: space[5] }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <View style={{ gap: 2 }}>
          <AppText variant="caption" color="inkMuted">Week {week} of 52</AppText>
          <AppText variant="title" accessibilityRole="header">Your plan</AppText>
        </View>
        <Avatar name={s.name} />
      </View>

      <Pressable accessibilityRole="button" onPress={() => router.push("/week")}>
        <Card tone="apricot" hero style={{ gap: 6 }}>
          <AppText variant="label" color="onPastel">THIS WEEK</AppText>
          <AppText variant="heading" color="onPastel" style={{ fontSize: 22 }}>{lesson.week}</AppText>
          <AppText color="onPastel">{s.lessonsRead[week] ? "Lesson read · three habits and two sessions" : "Lesson, three habits and two sessions"}</AppText>
        </Card>
      </Pressable>

      <RowCard tone="sky" onPress={() => router.push("/meals")}>
        <View style={{ flex: 1, gap: 2 }}>
          <AppText variant="label" color="onPastel">MEALS THIS WEEK</AppText>
          <AppText variant="heading" color="onPastel">{cooks} dinners, leftovers and a takeaway</AppText>
          <AppText variant="caption" color="onPastel">Recipes, swaps and your shopping list</AppText>
        </View>
      </RowCard>
      <RowCard onPress={() => router.push("/meals/next")}>
        <Disc icon="basket" tone="butter" />
        <View style={{ flex: 1, gap: 2 }}>
          <AppText variant="label" color="inkMuted">NEXT WEEK</AppText>
          <AppText weight="800" style={{ fontSize: 16 }}>{pr ? `${pr.chosen} of ${pr.total} meals picked` : "Pick your meals for next week"}</AppText>
          <AppText variant="caption" color="inkMuted">{pr ? "Your shopping list adds it all up" : "Then get one shopping list for the lot"}</AppText>
        </View>
      </RowCard>

      {PHASES.map((p) => {
        const weeks = Array.from({ length: p.to - p.from + 1 }, (_, i) => p.from + i);
        return (
          <Card key={p.key} style={{ gap: 12 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: c[`${p.tone}Ink` as const] }} />
                <AppText variant="heading">{p.name}</AppText>
              </View>
              <AppText variant="caption" color="inkMuted">Weeks {p.from}–{p.to}</AppText>
            </View>
            <AppText color="inkMuted">{p.focus}</AppText>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
              {weeks.map((w) => (
                <View key={w} accessibilityLabel={`Week ${w}${w < week ? ", done" : w === week ? ", this week" : ", coming up"}`}
                  style={{ width: 26, height: 26, borderRadius: radius.full, backgroundColor: w < week ? c.sageInk : w === week ? c.apricot : c.surfaceSunk, borderWidth: w === week ? 2 : w > week ? 1.5 : 0, borderColor: w === week ? c.apricotInk : c.line }} />
              ))}
            </View>
          </Card>
        );
      })}
    </Screen>
  );
}
