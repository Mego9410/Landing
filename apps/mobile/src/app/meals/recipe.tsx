import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { INGREDIENT, type Slot } from "@landing/content";
import { LABELS, plainName, quantity, reasons, replaceMeal } from "@landing/engine";
import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Screen } from "@/components/Screen";
import { DraftNote, Header, List, Pill, Stepper } from "@/components/ui";
import { dayName, mealAt, profileFor, px, saveWeekFor, SLOT_NAME, SLOT_TONE, weekFor, type Which } from "@/state/food";
import { set, useApp } from "@/state/store";
import { toast } from "@/state/toast";
import { radius, space, useColors } from "@/theme";

/**
 * M2 A recipe, fitted to the person: swaps explained, portions adjustable, method and allergens. Opened from a meal
 * (which, day, slot) it offers a swap; opened while picking (pick=1) it puts the recipe into that meal.
 */
export default function Recipe() {
  const s = useApp(), c = useColors();
  const q = useLocalSearchParams<{ id: string; which?: Which; day?: string; slot?: Slot; index?: string; pick?: string }>();
  const which: Which = q.which === "next" ? "next" : "this";
  const p = profileFor(s, which), x = px(s, q.id, which), r = x.recipe, n = x.nutrition, safe = s.settings.safeMode;
  const week = weekFor(s, which);
  const day = q.day != null ? Number(q.day) : null, slot = q.slot, index = Number(q.index ?? 0);
  const planned = week && day != null && slot ? mealAt(week, day, slot, index) : null;
  const inPlan = !!planned && planned.recipe === r.id;
  const [portions, setPortions] = useState(inPlan && planned?.cook ? planned.cook : r.slot === "dinner" ? p.household : 1);
  const lines = [...x.lines.map((l) => ({ ...l, topUp: false })), ...(x.topUp ? [{ i: x.topUp.i, g: x.topUp.g, optional: false, topUp: true }] : [])];
  const allergens = [...new Set(lines.flatMap((l) => INGREDIENT[l.i].allergens))];
  const swapped = Object.fromEntries(x.swaps.map((sw) => [sw.to, sw]));
  const why = week ? reasons(x, p, week) : [];
  const veg = Math.floor(n.vegGrams / 80);

  function use() {
    if (day == null || !slot) return;
    set((st) => { const w = weekFor(st, which); if (w) saveWeekFor(st, which, replaceMeal(w, profileFor(st, which), day, slot, r.id, index)); });
    toast(`${x.name} is on for ${which === "next" ? "next " : ""}${dayName(day)}.`);
    router.dismissTo(which === "next" ? "/meals/next" : "/meals");
  }

  return (
    <Screen contentContainerStyle={{ gap: space[5], paddingBottom: 48 }}>
      <Header fallback="/meals" middle={<Pill label={SLOT_NAME[r.slot]} tone={SLOT_TONE[r.slot]} />} />
      <View style={{ gap: 6 }}>
        <AppText variant="title" accessibilityRole="header">{x.name}</AppText>
        <AppText variant="bodyLg" color="inkMuted">{r.blurb}</AppText>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
          <Pill label={r.total <= 1 ? "No cooking" : `${r.total} min to the table`} />
          {r.total > r.handsOn ? <Pill label={`${r.handsOn} min hands-on`} /> : null}
          <Pill label={`${r.washUp} to wash up`} />
          {r.serves > 1 ? <Pill label={`Makes ${r.serves}`} /> : null}
          <Pill label={r.cuisine} />
        </View>
      </View>

      {safe ? (
        <Card style={{ gap: 6 }}>
          {n.protein >= 20 ? <AppText weight="800">Protein-rich</AppText> : null}
          {veg ? <AppText weight="800">{veg === 1 ? "A portion of veg" : `${veg} portions of veg`}</AppText> : null}
        </Card>
      ) : (
        <View style={{ gap: 6 }}>
          <View style={{ flexDirection: "row", gap: 10 }}>
            {[["Protein", `${n.protein} g`], ["Fibre", `${n.fibre} g`], p.conditions.includes("type-2-diabetes") ? ["Carbs", `${n.carbs} g`] : ["Veg portions", String(veg)]].map(([k, v]) => (
              <View key={k} style={{ flex: 1, alignItems: "center", gap: 2, padding: 12, borderRadius: radius.lg, backgroundColor: c.surfaceSunk }}>
                <AppText variant="heading">{v}</AppText>
                <AppText variant="caption" color="inkMuted">{k}</AppText>
              </View>
            ))}
          </View>
          <AppText variant="caption" color="inkMuted">Per portion, approximate.</AppText>
        </View>
      )}

      {why.length ? (
        <Card tone="sage" style={{ gap: 6 }}>
          <AppText variant="label" color="onPastel">WHY IT SUITS YOU</AppText>
          {why.map((w) => <AppText key={w} color="onPastel">• {w}</AppText>)}
        </Card>
      ) : null}

      <View style={{ gap: space[2] }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <AppText variant="heading">Ingredients</AppText>
          <Stepper value={portions} onChange={setPortions} unit={["portion", "portions"]} />
        </View>
        <List>
          {lines.map((l, i) => {
            const ing = INGREDIENT[l.i], sw = swapped[l.i];
            return (
              <View key={l.i + i} style={{ flexDirection: "row", gap: space[3], paddingVertical: space[3], paddingHorizontal: space[4], borderTopWidth: i ? 1 : 0, borderTopColor: c.line }}>
                <View style={{ flex: 1, gap: 2 }}>
                  <AppText weight="800">{ing.name}{l.optional ? <AppText color="inkMuted"> (if you like)</AppText> : null}</AppText>
                  {sw ? <AppText variant="caption" color="sageInk">Instead of {plainName(sw.from)}, for {sw.why}{sw.note ? `. ${sw.note}` : ""}</AppText> : null}
                  {l.topUp && x.topUp ? <AppText variant="caption" color="sageInk">{x.topUp.label}, to keep the protein up</AppText> : null}
                  {ing.pantry ? <AppText variant="caption" color="inkMuted">From the cupboard</AppText> : null}
                </View>
                <AppText variant="caption" weight="700">{quantity(l.i, l.g * portions)}</AppText>
              </View>
            );
          })}
        </List>
        <AppText variant="caption" color="inkMuted">
          {allergens.length ? `Contains ${allergens.map((a) => LABELS.allergen[a].toLowerCase()).join(", ")}. ` : "None of the 14 main allergens in these ingredients. "}Always check the labels, as products change.
        </AppText>
      </View>

      <View style={{ gap: space[3] }}>
        <AppText variant="heading">Method</AppText>
        {x.swaps.length ? (
          <Card tone="sunk" style={{ gap: 4 }}>
            <AppText variant="label" color="inkMuted">MADE FOR YOU</AppText>
            {x.swaps.map((sw) => <AppText key={sw.to}>Use the {plainName(sw.to)} where the method says {plainName(sw.from)}.</AppText>)}
          </Card>
        ) : null}
        {r.steps.map((st, i) => (
          <View key={i} style={{ flexDirection: "row", gap: space[3], alignItems: "flex-start" }}>
            <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: c.apricot, alignItems: "center", justifyContent: "center" }}>
              <AppText variant="caption" weight="800" color="onPastel">{i + 1}</AppText>
            </View>
            <AppText style={{ flex: 1 }}>{st}</AppText>
          </View>
        ))}
        {r.ahead ? <AppText variant="caption" color="inkMuted">Ahead: {r.ahead}.</AppText> : null}
        {r.kit.includes("tray") ? <AppText variant="caption" color="inkMuted">Times are for a fan oven, heated while you prep. An air fryer heats up faster, so it&apos;s usually a few minutes quicker.</AppText> : null}
        <AppText variant="caption" color="inkMuted">{r.fridgeDays ? `Keeps ${r.fridgeDays} ${r.fridgeDays === 1 ? "day" : "days"} in the fridge` : "Best eaten fresh"}{r.freezes ? " · Freezes" : ""}</AppText>
        {r.storeCupboard ? <AppText variant="caption" color="inkMuted">From the store cupboard: {r.storeCupboard}</AppText> : null}
      </View>

      <DraftNote />
      {q.pick && day != null && slot ? (
        <Button label={`Use this for ${which === "next" ? "next " : ""}${dayName(day)}`} block onPress={use} />
      ) : inPlan && day != null && slot ? (
        <Button label="Swap this meal" variant="secondary" block onPress={() => router.push({ pathname: "/meals/pick", params: { which, day: String(day), slot, index: String(index) } })} />
      ) : (
        <Button label="Add to my week" block onPress={() => router.push({ pathname: "/meals/add", params: { id: r.id } })} />
      )}
    </Screen>
  );
}
