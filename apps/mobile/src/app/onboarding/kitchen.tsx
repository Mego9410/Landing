import { router } from "expo-router";
import { KitchenPicker } from "@/components/FoodPickers";
import { Step } from "@/components/Onboarding";

/** O7c Your kitchen and your week. */
export default function Kitchen() {
  return (
    <Step n={4} title="Your kitchen and your week" lede="Meals take 15 minutes hands-on or less, with six ingredients or fewer. Tell us what you've got to work with." next={() => router.push("/onboarding/ready")}>
      <KitchenPicker />
    </Step>
  );
}
