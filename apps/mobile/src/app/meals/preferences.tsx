import { router } from "expo-router";
import { View } from "react-native";
import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { DietPicker, GoalPicker, KitchenPicker, MorePicker } from "@/components/FoodPickers";
import { Screen } from "@/components/Screen";
import { Banner, Header, List, Row } from "@/components/ui";
import { px, toggleFavourite, toggleNotForMe } from "@/state/food";
import { set, useApp } from "@/state/store";
import { toast } from "@/state/toast";
import { space } from "@/theme";

/** S7 Food preferences. Changing anything builds a fresh week. */
export default function FoodPreferences() {
  const s = useApp();
  const fav = s.food.favourites ?? [], no = s.food.notForMe ?? [];
  return (
    <Screen header={<Header fallback="/meals" title="Food preferences" />} contentContainerStyle={{ gap: space[6], paddingBottom: 48 }}>
      <View style={{ gap: 6 }}>
        <AppText variant="title" accessibilityRole="header">Food preferences</AppText>
        <AppText color="inkMuted">Your meal plan and recipe swaps follow these. Changing them builds a fresh week.</AppText>
      </View>
      {s.settings.safeMode ? <Banner>Habit Only mode is on, so meals are planned for holding steady and numbers stay hidden.</Banner> : (
        <View style={{ gap: space[2] }}>
          <AppText variant="label">WHAT WOULD YOU LIKE FOOD TO DO FOR YOU?</AppText>
          <GoalPicker />
        </View>
      )}
      <DietPicker />
      <KitchenPicker />
      <MorePicker />
      <View style={{ gap: space[2] }}>
        <AppText variant="label">MEALS YOU&apos;VE MARKED</AppText>
        {fav.length || no.length ? (
          <List>
            {fav.map((id, i) => (
              <Row key={id} first={i === 0} title={px(s, id).name} sub="Have it again: comes back every few weeks" chevron={false}
                right={<Button label="Remove" variant="quiet" onPress={() => { set((st) => toggleFavourite(st, id)); toast("Taken off your favourites."); }} />} />
            ))}
            {no.map((id, i) => (
              <Row key={id} first={!fav.length && i === 0} title={px(s, id).name} sub="Not for me: never planned" chevron={false}
                right={<Button label="Undo" variant="quiet" onPress={() => { set((st) => toggleNotForMe(st, id)); toast("It can come up in your plans again."); }} />} />
            ))}
          </List>
        ) : <AppText variant="caption" color="inkMuted">After cooking along, tap “Have it again” or “Not for me” and the meals you mark appear here.</AppText>}
      </View>
      <Button label="See my meals" block onPress={() => router.dismissTo("/meals")} />
    </Screen>
  );
}
