// Pieces the meal screens share: a meal row and the takeaway-night card.
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { ORDERING_WELL } from "@landing/content";
import type { Slot } from "@landing/content";
import type { Meal } from "@landing/engine";
import { dayName, minutes, proteinText, px, SLOT_NAME } from "@/state/food";
import { useApp } from "@/state/store";
import { AppText } from "./AppText";
import { Card } from "./Card";
import { Row } from "./ui";

/** The planned takeaway night, with ideas for ordering. Never "good" or "bad", just what helps. */
export function TakeawayCard() {
  const [open, setOpen] = useState(false);
  return (
    <Card tone="butter" style={{ gap: 8 }}>
      <AppText variant="label" color="onPastel">DINNER · TAKEAWAY NIGHT</AppText>
      <AppText weight="800" color="onPastel" style={{ fontSize: 16 }}>A night off cooking, planned in</AppText>
      <AppText color="onPastel">Enjoy it. A takeaway is part of a steady week.</AppText>
      <Pressable accessibilityRole="button" accessibilityState={{ expanded: open }} onPress={() => setOpen(!open)}>
        <AppText variant="caption" color="onPastel" style={{ textDecorationLine: "underline" }}>{open ? "Hide ideas for ordering" : "Ideas for ordering"}</AppText>
      </Pressable>
      {open ? (
        <View style={{ gap: 6 }}>
          {Object.entries(ORDERING_WELL).map(([k, v]) => <AppText key={k} variant="caption" color="onPastel"><AppText variant="caption" weight="800" color="onPastel">{k}. </AppText>{v}</AppText>)}
        </View>
      ) : null}
    </Card>
  );
}

/** One meal in a day list: tap to open the recipe, or to choose one when it's empty. */
export function MealRow({ meal, slot, day, which, first, index = 0 }: { meal: Meal | undefined; slot: Slot; day: number; which: "this" | "next"; first?: boolean; index?: number }) {
  const s = useApp();
  const open = () => router.push({ pathname: "/meals/pick", params: { which, day: String(day), slot, index: String(index) } });
  if (!meal || !meal.recipe) {
    const title = meal?.kind === "takeaway" ? "Takeaway night" : `Choose ${SLOT_NAME[slot].toLowerCase()}`;
    return <Row first={first} label={SLOT_NAME[slot].toUpperCase()} title={title} sub={meal?.kind === "takeaway" ? "A night off cooking" : undefined} titleColor={meal?.kind === "takeaway" ? "ink" : "apricotInk"} onPress={open} />;
  }
  const x = px(s, meal.recipe, which);
  const sub = meal.kind === "leftover"
    ? `Leftovers from ${dayName(meal.from!)} · ${proteinText(s, x.nutrition.protein)}`
    : `${minutes(x.recipe)} · ${proteinText(s, x.nutrition.protein)}${meal.cook && meal.cook > 1 ? ` · cook ${meal.cook}` : ""}`;
  return (
    <Row first={first} label={SLOT_NAME[slot].toUpperCase()} title={x.name} sub={sub}
      onPress={() => router.push({ pathname: "/meals/recipe", params: { id: meal.recipe!, which, day: String(day), slot, index: String(index) } })} />
  );
}

