import { router } from "expo-router";
import { View } from "react-native";
import { AppText } from "@/components/AppText";
import { GoalPicker } from "@/components/FoodPickers";
import { Step } from "@/components/Onboarding";
import { Choices } from "@/components/ui";
import { set, useApp, type Hungry } from "@/state/store";
import { space } from "@/theme";

const TIMES: Hungry[] = ["Morning", "Lunchtime", "Afternoon", "Evening", "Late night"];

/** O7 Food and hunger, and what food should do for you. */
export default function Food() {
  const s = useApp();
  return (
    <Step n={3} title="Food and hunger" lede="Appetite often comes back after the jab. Knowing your hungry times helps us plan around them." next={() => router.push("/onboarding/eating")}>
      <View style={{ gap: space[2] }}>
        <AppText variant="label">WHEN DO YOU USUALLY FEEL HUNGRIEST? PICK ANY</AppText>
        <Choices label="Hungriest times" value={s.ob.hungryTimes} onChange={(v) => set((st) => { st.ob.hungryTimes = v as Hungry[]; })} options={TIMES.map((t) => ({ id: t, label: t }))} />
      </View>
      <View style={{ gap: space[2] }}>
        <AppText variant="label">WHAT WOULD YOU LIKE FOOD TO DO FOR YOU?</AppText>
        <GoalPicker />
      </View>
    </Step>
  );
}
