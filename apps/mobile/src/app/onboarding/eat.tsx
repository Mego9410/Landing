import { router } from "expo-router";
import { View } from "react-native";
import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { Chip, Chips, Lede, OnbScreen, Title } from "@/components/Onboarding";
import { set, useApp, type FoodPrefs } from "@/state/store";
import { space } from "@/theme";

const DIETS: { id: FoodPrefs["diet"]; label: string }[] = [
  { id: "none", label: "Everything" }, { id: "vegetarian", label: "Vegetarian" }, { id: "vegan", label: "Vegan" },
  { id: "pescatarian", label: "Pescatarian" }, { id: "halal", label: "Halal" }, { id: "kosher", label: "Kosher" },
];
// "Leave out" chips, as the allergens the recipe filter knows.
const LEAVE_OUT: { label: string; allergens: string[] }[] = [
  { label: "Gluten", allergens: ["gluten"] }, { label: "Dairy", allergens: ["milk"] }, { label: "Nuts", allergens: ["peanuts", "tree-nuts"] },
  { label: "Eggs", allergens: ["eggs"] }, { label: "Fish", allergens: ["fish"] },
];
const KITCHEN: { label: string; kit: string[] }[] = [
  { label: "Hob and oven", kit: ["hob", "oven"] }, { label: "Air fryer", kit: ["air-fryer"] }, { label: "Microwave only", kit: ["microwave"] },
];

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: 10, marginTop: space[4] }}>
      <AppText variant="label" color="inkMuted">{label}</AppText>
      <Chips>{children}</Chips>
    </View>
  );
}

/** 15 · Anything we should plan your meals around? Diet, what to leave out (a hard filter), and the kitchen. The rest of
 *  the food preferences (household, cooking nights, budget...) keep their defaults and live in Settings. */
export default function Eat() {
  const s = useApp(), f = s.food;
  const food = (fn: (f: FoodPrefs) => void) => set((st) => { fn(st.food); st.food.plan = null; });
  const microwaveOnly = f.kit.includes("microwave") && !f.kit.includes("hob") && !f.kit.includes("oven") && !f.kit.includes("air-fryer");
  return (
    <OnbScreen route="eat" footer={<>
      <Button label="Continue" variant="brand" block onPress={() => router.push("/onboarding/strength")} />
      <AppText variant="caption" color="inkMuted" style={{ textAlign: "center" }}>Allergies filter every ingredient, but always check labels too.</AppText>
    </>}>
      <Title>Anything we should plan your meals around?</Title>
      <Lede>Every recipe has swaps. Change this any time.</Lede>
      <Group label="HOW YOU EAT">
        {DIETS.map((d) => <Chip key={d.id} label={d.label} on={f.diet === d.id} onPress={() => food((x) => { x.diet = d.id; })} />)}
      </Group>
      <Group label="LEAVE OUT">
        {LEAVE_OUT.map((o) => {
          const on = o.allergens.every((a) => f.allergens.includes(a));
          return <Chip key={o.label} multi label={o.label} on={on} onPress={() => food((x) => { x.allergens = on ? x.allergens.filter((a) => !o.allergens.includes(a)) : [...new Set([...x.allergens, ...o.allergens])]; })} />;
        })}
      </Group>
      <Group label="YOUR KITCHEN">
        {KITCHEN.map((k) => {
          const on = k.label === "Microwave only" ? microwaveOnly : k.kit.every((x) => f.kit.includes(x));
          return (
            <Chip key={k.label} multi label={k.label} on={on} onPress={() => food((x) => {
              if (k.label === "Microwave only") { x.kit = on ? ["hob", "oven", "microwave", "kettle"] : ["microwave", "kettle"]; return; }
              const rest = x.kit.filter((i) => !k.kit.includes(i));
              x.kit = on ? (rest.some((i) => i !== "kettle") ? rest : ["microwave", "kettle"]) : [...new Set([...rest, ...k.kit, "microwave", "kettle"])];
            })} />
          );
        })}
      </Group>
    </OnbScreen>
  );
}
