import { router, useLocalSearchParams } from "expo-router";
import { Pressable, View } from "react-native";
import type { Slot } from "@landing/content";
import { leftoverOptions, setMeal, swapOptions, type Choice } from "@landing/engine";
import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Screen } from "@/components/Screen";
import { Disc, Header } from "@/components/ui";
import { dayName, INCLUDE_DRAFTS, mealAt, minutes, profileFor, proteinText, px, saveWeekFor, SLOT_NAME, SLOT_TONE, weekFor, type Which } from "@/state/food";
import { set, useApp } from "@/state/store";
import { toast } from "@/state/toast";
import { radius, space, useColors } from "@/theme";

function Option({ title, detail, onPress, tone }: { title: string; detail: string; onPress: () => void; tone?: "butter" | "sky" | "apricot" | "sage" }) {
  const c = useColors();
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", gap: space[3], padding: space[4], borderRadius: radius.md, backgroundColor: pressed ? c.surfaceSunk : c.surfaceRaised })}>
      {tone ? <Disc icon="meal" tone={tone} size={40} /> : null}
      <View style={{ flex: 1, gap: 2 }}>
        <AppText weight="800">{title}</AppText>
        <AppText variant="caption" color="inkMuted">{detail}</AppText>
      </View>
    </Pressable>
  );
}

/** M5/M8 Pick or swap one meal: suggestions, leftovers, a takeaway night, the full library, or leave it empty. */
export default function Pick() {
  const s = useApp();
  const q = useLocalSearchParams<{ which?: Which; day: string; slot: Slot; index?: string }>();
  const which: Which = q.which === "next" ? "next" : "this";
  const day = Number(q.day), slot = q.slot, index = Number(q.index ?? 0);
  const week = weekFor(s, which);
  if (!week) return null;
  const p = profileFor(s, which), current = mealAt(week, day, slot, index);
  const lefts = leftoverOptions(week, p, day, slot);
  const options = swapOptions(week, p, day, slot, { n: 4, includeDrafts: INCLUDE_DRAFTS, seed: s.food.seed + day });
  function choose(choice: Choice) {
    set((st) => { const w = weekFor(st, which); if (w) saveWeekFor(st, which, setMeal(w, profileFor(st, which), day, slot, choice, index)); });
    if (which === "this") toast(`Updated for ${dayName(day)}. Your shopping list follows.`);
    router.back();
  }
  return (
    <Screen header={<Header close fallback="/meals" title={`${which === "next" ? "Next " : ""}${dayName(day)}'s ${SLOT_NAME[slot].toLowerCase()}`} />} contentContainerStyle={{ gap: space[4], paddingBottom: 48 }}>
      <AppText variant="title">{which === "next" ? "Next " : ""}{dayName(day)}&apos;s {SLOT_NAME[slot].toLowerCase()}</AppText>
      {current?.recipe ? (
        <Card tone="sunk" style={{ gap: 2 }}>
          <AppText variant="caption" color="inkMuted">{current.kind === "leftover" ? "Leftovers, instead of" : "Instead of"}</AppText>
          <AppText weight="800">{px(s, current.recipe, which).name}</AppText>
        </Card>
      ) : null}
      <AppText variant="label" color="inkMuted">SUGGESTED FOR YOU</AppText>
      <View style={{ gap: space[2] }}>
        {options.map((x) => <Option key={x.recipe.id} tone={SLOT_TONE[slot]} title={x.name} detail={`${minutes(x.recipe)} · ${proteinText(s, x.nutrition.protein)}`} onPress={() => choose({ recipe: x.recipe.id })} />)}
      </View>
      <Button label={`See all ${SLOT_NAME[slot].toLowerCase()} recipes`} variant="secondary" block
        onPress={() => router.replace({ pathname: "/meals/recipes", params: { which, day: String(day), slot, index: String(index) } })} />
      {lefts.length || slot === "dinner" ? <AppText variant="label" color="inkMuted">OR</AppText> : null}
      <View style={{ gap: space[2] }}>
        {lefts.map((o) => <Option key={o.from} title={`Leftovers: ${o.name}`} detail={`Cook extra on ${dayName(o.from)}`} onPress={() => choose({ leftoverFrom: o.from })} />)}
        {slot === "dinner" ? <Option title="Takeaway night" detail="A night off cooking, planned in" onPress={() => choose({ kind: "takeaway" })} /> : null}
      </View>
      {current && current.kind !== "free" ? <Button label="Leave it empty" variant="quiet" onPress={() => choose({ kind: "free" })} style={{ alignSelf: "center" }} /> : null}
    </Screen>
  );
}
