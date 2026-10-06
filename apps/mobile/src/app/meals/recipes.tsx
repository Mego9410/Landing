import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { TextInput, View } from "react-native";
import type { Slot } from "@landing/content";
import { library } from "@landing/engine";
import { AppText } from "@/components/AppText";
import { Screen } from "@/components/Screen";
import { Choices, Disc, DraftNote, Header, RowCard, ToggleRow } from "@/components/ui";
import { dayName, INCLUDE_DRAFTS, minutes, profileFor, proteinText, SLOT_NAME, SLOT_TONE, type Which } from "@/state/food";
import { useApp } from "@/state/store";
import { radius, space, textStyle, useColors } from "@/theme";

const COLLECTIONS = [
  { id: "quick", label: "10 minutes or less" }, { id: "no-cook", label: "No cooking" }, { id: "fakeaway", label: "Fakeaways" },
  { id: "batch", label: "Batch and freeze" }, { id: "gentle", label: "Gentle on the stomach" }, { id: "store-cupboard", label: "Store cupboard" },
  { id: "microwave", label: "Microwave only" }, { id: "on-the-go", label: "On the go" }, { id: "family", label: "Family" },
];

/** M3 The recipe library. With a day and slot it's picking for that meal. */
export default function Recipes() {
  const s = useApp(), c = useColors();
  const q = useLocalSearchParams<{ which?: Which; day?: string; slot?: Slot; index?: string }>();
  const picking = q.day != null && !!q.slot;
  const which: Which = q.which === "next" ? "next" : "this";
  const [query, setQuery] = useState("");
  const [slot, setSlot] = useState<string>(picking ? q.slot! : "all");
  const [coll, setColl] = useState<string[]>([]);
  const [all, setAll] = useState(false);
  const lib = library(profileFor(s, which), { all: true, includeDrafts: INCLUDE_DRAFTS });
  const shown = lib.filter((x) => {
    const r = x.recipe;
    if (slot !== "all" && r.slot !== slot) return false;
    for (const k of coll) if (k === "quick" ? r.total > 10 : !r.collections.includes(k as never)) return false;
    if (query && !`${x.name} ${r.blurb} ${r.cuisine}`.toLowerCase().includes(query.toLowerCase())) return false;
    return all || x.ok;
  });
  const suits = lib.filter((x) => x.ok).length;
  return (
    <Screen contentContainerStyle={{ gap: space[4], paddingBottom: 48 }}>
      <Header fallback="/meals" right={<AppText variant="caption" color="inkMuted">{suits} of {lib.length} suit you</AppText>} />
      <AppText variant="title" accessibilityRole="header">{picking ? `Choose ${SLOT_NAME[q.slot!].toLowerCase()} for ${which === "next" ? "next " : ""}${dayName(Number(q.day))}` : "Recipes"}</AppText>
      <TextInput accessibilityLabel="Search recipes" value={query} onChangeText={setQuery} placeholder="Try chilli, salmon or no-cook" placeholderTextColor={c.inkMuted}
        style={[textStyle("bodyLg"), { height: 52, borderRadius: radius.md, paddingHorizontal: space[4], backgroundColor: c.surfaceRaised, borderWidth: 1.5, borderColor: c.line, color: c.ink }]} />
      {picking ? null : (
        <Choices label="Meal" value={slot} onChange={(v) => setSlot(v as string)}
          options={[{ id: "all", label: "All meals" }, ...(["breakfast", "lunch", "dinner", "snack"] as Slot[]).map((k) => ({ id: k, label: SLOT_NAME[k] + (k === "snack" ? "s" : "") }))]} />
      )}
      <AppText variant="label" color="inkMuted">COLLECTIONS</AppText>
      <Choices label="Collections" value={coll} onChange={(v) => setColl(v as string[])} options={COLLECTIONS} />
      <View style={{ gap: 10 }}>
        {shown.length ? shown.map((x) => (
          <View key={x.recipe.id} style={{ opacity: x.ok ? 1 : 0.6 }}>
            <RowCard onPress={() => router.push({ pathname: "/meals/recipe", params: { id: x.recipe.id, which, ...(picking ? { day: q.day!, slot: q.slot!, index: q.index ?? "0", pick: "1" } : {}) } })}>
              <Disc icon="meal" tone={SLOT_TONE[x.recipe.slot]} size={44} />
              <View style={{ flex: 1, gap: 2 }}>
                <AppText weight="800">{x.name}</AppText>
                <AppText variant="caption" color="inkMuted">{minutes(x.recipe)} · {proteinText(s, x.nutrition.protein)}{x.swaps.length ? " · adapted for you" : ""}</AppText>
                {x.ok ? null : <AppText variant="caption" color="roseInk">Not for you: {x.blocked.join(", ")}</AppText>}
              </View>
            </RowCard>
          </View>
        )) : <AppText color="inkMuted">No recipes match. Try another search or clear a filter.</AppText>}
      </View>
      <ToggleRow title="Show recipes that don't suit me" value={all} onChange={setAll} />
      <DraftNote />
    </Screen>
  );
}
