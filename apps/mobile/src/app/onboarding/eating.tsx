import { router } from "expo-router";
import { DietPicker } from "@/components/FoodPickers";
import { Step } from "@/components/Onboarding";

/** O7b How you eat. */
export default function Eating() {
  return (
    <Step n={3} title="How you eat" lede="So every recipe we suggest works for you. You can change this any time in Settings." next={() => router.push("/onboarding/kitchen")}>
      <DietPicker />
    </Step>
  );
}
