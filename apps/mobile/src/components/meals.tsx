// Pieces the meal screens share: a meal row, the takeaway-night card and "Have it again" / "Not for me".
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { ORDERING_WELL } from "@landing/content";
import type { Slot } from "@landing/content";
import { plainName, type Meal } from "@landing/engine";
import { dayName, isNew, minutes, proteinText, px, SLOT_NAME, toggleFavourite, toggleNotForMe } from "@/state/food";
import { set, useApp } from "@/state/store";
import { toast } from "@/state/toast";
import { Button } from "./Button";
import { AppText } from "./AppText";
import { Card } from "./Card";
import { Pill, Row } from "./ui";

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

/** One meal in a day list: tap to open the recipe, or to choose one when it's empty. A meal that no longer suits their
 *  preferences says so; one they've never had gets a small "New to you". */
export function MealRow({ meal, slot, day, which, first, index = 0 }: { meal: Meal | undefined; slot: Slot; day: number; which: "this" | "next"; first?: boolean; index?: number }) {
  const s = useApp();
  const open = () => router.push({ pathname: "/meals/pick", params: { which, day: String(day), slot, index: String(index) } });
  if (!meal || !meal.recipe) {
    const title = meal?.kind === "takeaway" ? "Takeaway night" : `Choose ${SLOT_NAME[slot].toLowerCase()}`;
    return <Row first={first} label={SLOT_NAME[slot].toUpperCase()} title={title} sub={meal?.kind === "takeaway" ? "A night off cooking" : undefined} titleColor={meal?.kind === "takeaway" ? "ink" : "apricotInk"} onPress={open} />;
  }
  const x = px(s, meal.recipe, which);
  if (!x.ok) {
    return <Row first={first} label={SLOT_NAME[slot].toUpperCase()} title={x.name} titleColor="roseInk" sub="Doesn't suit your preferences now. Tap to choose another." onPress={open} />;
  }
  const sub = meal.kind === "leftover"
    ? `Leftovers from ${dayName(meal.from!)} · ${proteinText(s, x.nutrition.protein)}`
    : `${minutes(x.recipe)} · ${proteinText(s, x.nutrition.protein)}${meal.cook && meal.cook > 1 ? ` · cook ${meal.cook}` : ""}`;
  const fresh = meal.kind === "cook" && isNew(s, meal.recipe);
  return (
    <Row first={first} label={SLOT_NAME[slot].toUpperCase()} title={x.name} sub={sub} right={fresh ? <Pill label="New to you" tone="sage" /> : undefined}
      onPress={() => router.push({ pathname: "/meals/recipe", params: { id: meal.recipe!, which, day: String(day), slot, index: String(index) } })} />
  );
}


/** "Have it again" brings a recipe back every few weeks; "Not for me" stops it being planned. Both undo in place, and
 *  from Food preferences. */
export function MealVerdict({ id }: { id: string }) {
  const s = useApp();
  const fav = (s.food.favourites ?? []).includes(id), no = (s.food.notForMe ?? []).includes(id);
  return (
    <View style={{ flexDirection: "row", gap: 8 }}>
      <View style={{ flex: 1 }}>
        <Button label={fav ? "Coming back again" : "Have it again"} icon={fav ? "check" : undefined} variant="secondary" block onPress={() => {
          set((st) => toggleFavourite(st, id));
          toast(fav ? "Taken off your favourites." : "We'll bring it back every few weeks.");
        }} />
      </View>
      <View style={{ flex: 1 }}>
        <Button label={no ? "Plan it again" : "Not for me"} variant="secondary" block onPress={() => {
          set((st) => toggleNotForMe(st, id));
          toast(no ? "It can come up in your plans again." : "We won't plan it again. You can change this in Food preferences.");
        }} />
      </View>
    </View>
  );
}

/** The swaps made for this person, which the method already uses. Shared with the cook-along. */
export function MadeForYou({ swaps }: { swaps: { from: string; to: string }[] }) {
  const seen = new Set<string>();
  return (
    <Card tone="sunk" style={{ gap: 4 }}>
      <AppText variant="label" color="inkMuted">MADE FOR YOU</AppText>
      {swaps.filter((sw) => !seen.has(sw.from) && seen.add(sw.from)).map((sw) => <AppText key={sw.from}>{cap(plainName(sw.to))} in place of {plainName(sw.from)}. The method uses it already.</AppText>)}
    </Card>
  );
}
const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);
