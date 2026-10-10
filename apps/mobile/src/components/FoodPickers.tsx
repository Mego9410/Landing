// The food questions, shared by onboarding and Food preferences. Every change clears this week's edited plan so
// the week is rebuilt for the new answers, and swaps out any of next week's meals that no longer suit.
import { View } from "react-native";
import { LABELS } from "@landing/engine";
import { refitNext } from "@/state/food";
import { set, useApp, type FoodPrefs } from "@/state/store";
import { space } from "@/theme";
import { AppText } from "./AppText";
import { Choices, Options, ToggleRow } from "./ui";

export function setFood(patch: Partial<FoodPrefs>) {
  set((s) => { Object.assign(s.food, patch, { plan: null }); refitNext(s); });
}
const opts = <K extends string>(names: Record<K, string>, ids: K[]) => ids.map((id) => ({ id, label: names[id] }));

function Q({ label, children, note }: { label: string; children: React.ReactNode; note?: string }) {
  return (
    <View style={{ gap: space[2] }}>
      <AppText variant="label">{label}</AppText>
      {children}
      {note ? <AppText variant="caption" color="inkMuted">{note}</AppText> : null}
    </View>
  );
}

export function GoalPicker() {
  const s = useApp();
  return (
    <Options label="What food should do for you" value={s.food.goal} onChange={(goal) => setFood({ goal })} options={[
      { id: "steady", title: "Hold steady", detail: "Protein at every meal and a rhythm that keeps hunger predictable" },
      { id: "strength", title: "Build strength", detail: "A little more protein, to go with your strength sessions" },
      { id: "fuller", title: "Feel fuller for longer", detail: "More fibre and veg, and a snack at your hungriest time" },
    ]} />
  );
}

const DIETS = ["none", "vegetarian", "vegan", "pescatarian", "halal", "kosher", "veg-no-egg", "jain"] as const;
const ALLERGENS = ["gluten", "milk", "eggs", "peanuts", "tree-nuts", "sesame", "soya", "fish", "crustaceans", "molluscs", "mustard", "celery", "lupin", "sulphites"] as const;
const AVERSIONS = ["spicy", "rich", "strong-smells", "meat", "fish", "eggs", "dairy"] as const;
const KIT = ["hob", "oven", "air-fryer", "microwave", "kettle"] as const;

export function DietPicker() {
  const s = useApp(), f = s.food;
  return (
    <View style={{ gap: space[5] }}>
      <Q label="YOUR DIET">
        <Choices label="Diet" value={f.diet} onChange={(v) => setFood({ diet: v as FoodPrefs["diet"] })} options={opts(LABELS.diet, [...DIETS])} />
      </Q>
      <Q label="ALLERGIES" note="Allergies are a hard filter on every ingredient. Always check labels too.">
        <Choices label="Allergies" value={f.allergens} onChange={(v) => setFood({ allergens: v as string[] })} options={opts(LABELS.allergen, [...ALLERGENS])} />
        <ToggleRow title="Lactose intolerant (not an allergy)" value={f.lactoseFree} onChange={(lactoseFree) => setFood({ lactoseFree })} />
      </Q>
      <Q label="ANYTHING YOU CAN'T FACE AT THE MOMENT?" note="Common after the jab. We'll check in again in eight weeks.">
        <Choices label="Foods you can't face" value={f.aversions} onChange={(v) => setFood({ aversions: v as string[] })} options={opts(LABELS.aversion, [...AVERSIONS])} />
      </Q>
    </View>
  );
}

export function KitchenPicker() {
  const s = useApp(), f = s.food;
  return (
    <View style={{ gap: space[5] }}>
      <Q label="YOUR KITCHEN">
        <Choices label="Kitchen kit" value={f.kit} onChange={(v) => setFood({ kit: (v as string[]).length ? (v as string[]) : ["microwave"] })} options={opts(LABELS.kit, [...KIT])} />
      </Q>
      <Q label="HANDS-ON TIME ON A WEEKDAY" note="Time spent chopping and stirring. Oven and simmering time don't count, as you're free then.">
        <Choices label="Hands-on time" value={f.maxMinutes} onChange={(v) => setFood({ maxMinutes: v as number })} options={[{ id: 10, label: "10 min" }, { id: 15, label: "15 min" }, { id: 20, label: "No limit" }]} />
      </Q>
      <Q label="HOW MANY EAT DINNER?">
        <Choices label="People at dinner" value={f.household} onChange={(v) => setFood({ household: v as number })} options={[{ id: 1, label: "Just me" }, { id: 2, label: "2" }, { id: 3, label: "3" }, { id: 4, label: "4" }, { id: 5, label: "5 or more" }]} />
      </Q>
      <Q label="DINNERS TO COOK A WEEK" note="The other nights are leftovers, a takeaway and a free night.">
        <Choices label="Dinners to cook" value={f.cookNights} onChange={(v) => setFood({ cookNights: v as 3 | 4 | 5 })} options={[{ id: 3, label: "3 nights" }, { id: 4, label: "4 nights" }, { id: 5, label: "5 nights" }]} />
      </Q>
    </View>
  );
}

const CONDITIONS = ["type-2-diabetes", "high-blood-pressure", "reflux"] as const;
const CUISINES = ["British", "South Asian", "Chinese", "Thai", "Japanese", "Mexican", "Italian", "Mediterranean", "Middle Eastern", "Caribbean", "West African", "Eastern European", "American"];

export function MorePicker() {
  const s = useApp(), f = s.food;
  return (
    <View style={{ gap: space[5] }}>
      <Q label="ANY OF THESE?" note="These change which recipes we suggest, never your treatment. Pregnancy and kidney disease are handled in the safety questions.">
        <Choices label="Health" value={f.conditions} onChange={(v) => setFood({ conditions: v as string[] })} options={opts(LABELS.condition, [...CONDITIONS])} />
      </Q>
      <Q label="CUISINES YOU'D LIKE MORE OF">
        <Choices label="Cuisines" value={f.cuisines} onChange={(v) => setFood({ cuisines: v as string[] })} options={CUISINES.map((c) => ({ id: c, label: c }))} />
      </Q>
      <Q label="BUDGET PER PORTION" note="Estimates at 2026 prices. Your supermarket's price is the real one.">
        <Choices label="Budget" value={f.budget} onChange={(v) => setFood({ budget: v as 1 | 2 | 3 })} options={[{ id: 1, label: "Under £1.50" }, { id: 2, label: "Up to £2.50" }, { id: 3, label: "No limit" }]} />
      </Q>
    </View>
  );
}
