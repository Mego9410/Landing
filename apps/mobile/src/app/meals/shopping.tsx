import { router, useLocalSearchParams } from "expo-router";
import { Pressable, View } from "react-native";
import { progress, shoppingList } from "@landing/engine";
import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Icon } from "@/components/Icon";
import { Screen } from "@/components/Screen";
import { Header, List } from "@/components/ui";
import { dayName, nextDate, profileFor, weekFor, type Which } from "@/state/food";
import { set, useApp } from "@/state/store";
import { space, useColors } from "@/theme";

/**
 * M4/M9 The shopping list for this week or next. Every ingredient is added up across the dishes that use it, with
 * each dish's share underneath ("260 g · Chicken fajita tray, Wed") and what to buy.
 */
export default function Shopping() {
  const s = useApp(), c = useColors();
  const q = useLocalSearchParams<{ which?: Which }>();
  const which: Which = q.which === "next" ? "next" : "this";
  const week = weekFor(s, which);
  if (!week) {
    return (
      <Screen header={<Header fallback="/meals" title="Nothing picked yet" />}>
        <AppText variant="title">Nothing picked yet</AppText>
        <Button label="Plan next week" onPress={() => router.replace("/meals/next")} />
      </Screen>
    );
  }
  const p = profileFor(s, which), list = shoppingList(week, p), pr = progress(week);
  const ticked = (which === "next" ? s.food.next?.ticked : s.food.ticked) ?? {};
  const total = list.aisles.reduce((a, x) => a + x.items.length, 0), done = list.aisles.reduce((a, x) => a + x.items.filter((i) => ticked[i.id]).length, 0);
  const tick = (id: string) => set((st) => {
    const t = which === "next" ? st.food.next!.ticked : st.food.ticked;
    if (t[id]) delete t[id]; else t[id] = true;
  });
  return (
    <Screen header={<Header fallback="/meals" right={<AppText variant="caption" color="inkMuted">{done} of {total} ticked</AppText>} title={which === "next" ? "Next week's shopping" : "Shopping list"} />} contentContainerStyle={{ gap: space[4], paddingBottom: 48 }}>
      <View style={{ gap: 6 }}>
        <AppText variant="title" accessibilityRole="header">{which === "next" ? "Next week's shopping" : "Shopping list"}</AppText>
        <AppText color="inkMuted">
          {which === "next" ? `For the ${pr.chosen} meals you picked for ${nextDate(0)} to ${nextDate(6)}. ` : "Everything for this week's meals. "}
          Each ingredient is added up across every dish that uses it, for {p.household === 1 ? "one" : `${p.household} people`} at dinner.
        </AppText>
      </View>
      {list.aisles.length ? null : <Card tone="sunk"><AppText>Pick some meals and their ingredients appear here.</AppText></Card>}
      {list.aisles.map((a) => (
        <View key={a.aisle} style={{ gap: space[2] }}>
          <AppText variant="label" color="inkMuted">{a.aisle.toUpperCase()}</AppText>
          <List>
            {a.items.map((it, i) => {
              const on = !!ticked[it.id];
              return (
                <Pressable key={it.id} accessibilityRole="checkbox" accessibilityState={{ checked: on }} accessibilityLabel={`${it.total} ${it.name}, buy ${it.label}`} onPress={() => tick(it.id)}
                  style={{ flexDirection: "row", gap: space[3], paddingVertical: space[3], paddingHorizontal: space[4], borderTopWidth: i ? 1 : 0, borderTopColor: c.line }}>
                  <View style={{ width: 26, height: 26, borderRadius: 8, marginTop: 1, alignItems: "center", justifyContent: "center", backgroundColor: on ? c.sageInk : "transparent", borderWidth: on ? 0 : 2, borderColor: c.inkMuted }}>
                    {on ? <Icon name="check" size={16} color={c.surfaceRaised} strokeWidth={2.6} /> : null}
                  </View>
                  <View style={{ flex: 1, gap: 3, opacity: on ? 0.55 : 1 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", gap: space[2] }}>
                      <AppText weight="800" style={{ flex: 1, textDecorationLine: on ? "line-through" : "none" }}>{it.name}</AppText>
                      <AppText weight="800">{it.total}</AppText>
                    </View>
                    {it.uses.length > 1
                      ? it.uses.map((u, k) => <AppText key={k} variant="caption" color="inkMuted">{u.amount} · {u.name}, {dayName(u.day).slice(0, 3)}</AppText>)
                      : <AppText variant="caption" color="inkMuted">{it.uses[0].name}, {dayName(it.uses[0].day).slice(0, 3)}</AppText>}
                    <AppText variant="caption">Buy {it.label}</AppText>
                  </View>
                </Pressable>
              );
            })}
          </List>
        </View>
      ))}
      {list.pantry.length ? (
        <Card tone="sunk" style={{ gap: 6 }}>
          <AppText variant="label" color="inkMuted">CHECK THE CUPBOARD</AppText>
          <AppText>{list.pantry.join(", ")}</AppText>
        </Card>
      ) : null}
      {list.batchNotes.map((n) => <AppText key={n} variant="caption" color="inkMuted">{n}</AppText>)}
      <AppText variant="caption" color="inkMuted">Totals are for the portions you&apos;ll cook, leftovers included. Packs are rounded up to what&apos;s sold, and products vary, so check labels for allergens.</AppText>
      {done ? <Button label="Untick everything" variant="quiet" style={{ alignSelf: "center" }} onPress={() => set((st) => { if (which === "next") st.food.next!.ticked = {}; else st.food.ticked = {}; })} /> : null}
    </Screen>
  );
}
