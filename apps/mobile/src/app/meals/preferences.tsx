import { router } from "expo-router";
import { View } from "react-native";
import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { DietPicker, GoalPicker, KitchenPicker, MorePicker } from "@/components/FoodPickers";
import { Screen } from "@/components/Screen";
import { Banner, Header } from "@/components/ui";
import { useApp } from "@/state/store";
import { space } from "@/theme";

/** S7 Food preferences. Changing anything builds a fresh week. */
export default function FoodPreferences() {
  const s = useApp();
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
      <Button label="See my meals" block onPress={() => router.dismissTo("/meals")} />
    </Screen>
  );
}
