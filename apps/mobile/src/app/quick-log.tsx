import { router } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { Screen } from "@/components/Screen";
import { Choices, Field, Header } from "@/components/ui";
import { today } from "@/data/dates";
import { kgFromStLb } from "@/data/units";
import { saveWeight } from "@/state/appleHealth";
import { logMeal, logProtein } from "@/state/habits";
import { dayLog, set, useApp } from "@/state/store";
import { toast } from "@/state/toast";
import { space } from "@/theme";

const MEALS = ["Breakfast", "Lunch", "Dinner", "Snack"] as const;
const LB_PER_KG = 2.20462;

/** T2 Quick log: protein for a meal and today's weight, in one go. Weight is in the person's chosen units. */
export default function QuickLog() {
  const s = useApp();
  const stlb = s.settings.units === "stlb";
  const existing = s.weights.find((w) => w.date === today() && w.source === "Logged by you")?.kg;
  const safe = s.settings.safeMode, log = dayLog(s);
  const [meal, setMeal] = useState<string>(MEALS.find((m) => log.protein?.[m] == null && !log.meals?.includes(m)) ?? "Snack");
  const already = log.protein?.[meal];
  const [protein, setProtein] = useState("");
  const [kgText, setKgText] = useState(existing != null && !stlb ? String(existing) : "");
  const lbTotal = existing != null ? Math.round(existing * LB_PER_KG) : null;
  const [stText, setStText] = useState(lbTotal != null && stlb ? String(Math.floor(lbTotal / 14)) : "");
  const [lbText, setLbText] = useState(lbTotal != null && stlb ? String(lbTotal % 14) : "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function save() {
    const e: Record<string, string> = {};
    const num = (v: string) => parseFloat(v.replace(",", "."));
    const g = protein.trim() === "" ? null : num(protein);
    let kg: number | null = null;
    if (stlb) { if (stText.trim() !== "" || lbText.trim() !== "") kg = kgFromStLb(num(stText || "0"), num(lbText || "0")); }
    else if (kgText.trim() !== "") kg = num(kgText);
    if (g != null && !(g >= 0 && g <= 150)) e.protein = "That looks high for one meal. Check the number and try again.";
    if (kg != null && !(kg >= 30 && kg <= 300)) e.weight = stlb ? "Enter your weight in stones and pounds, like 12 st 5 lb." : "Enter your weight in kilograms, like 78.4.";
    setErrors(e);
    if (Object.keys(e).length) return;
    // In Habit Only mode a meal can be logged without grams: it still counts as protein at that meal.
    if (g == null && kg == null && !safe) { router.back(); return; }
    set((st) => {
      if (g != null) logProtein(st, meal, g);
      else if (safe) logMeal(st, meal);
      if (kg != null) { const t = today(); st.weights = st.weights.filter((w) => w.date !== t); st.weights.unshift({ date: t, kg: Math.round(kg * 10) / 10, source: "Logged by you" }); }
    });
    if (kg != null) saveWeight(Math.round(kg * 10) / 10);
    toast("Logged. Nice one.");
    router.back();
  }

  return (
    <Screen header={<Header close fallback="/" title="Quick log" />} contentContainerStyle={{ gap: space[5], paddingBottom: 48 }}>
      <AppText variant="title">Quick log</AppText>
      <View style={{ gap: space[2] }}>
        <AppText weight="700">Meal</AppText>
        <Choices label="Meal" options={MEALS.map((m) => ({ id: m, label: m }))} value={meal} onChange={(v) => setMeal(v as string)} />
      </View>
      {safe ? <AppText color="inkMuted">Had some protein with this meal? Save it and it counts. Grams are optional.</AppText> : null}
      <Field label={safe ? "Protein, this meal (optional)" : "Protein, this meal"} value={protein} onChangeText={setProtein} keyboardType="decimal-pad" suffix="g" placeholder="30" error={errors.protein}
        hint={!safe && already ? `Adds to the ${already} g already logged for ${meal.toLowerCase()} today` : undefined} />
      {safe ? null : stlb ? (
        <View style={{ gap: 6 }}>
          <View style={{ flexDirection: "row", gap: space[3] }}>
            <Field label="Today's weight (optional)" value={stText} onChangeText={setStText} keyboardType="number-pad" suffix="st" placeholder="12" />
            <Field label=" " accessibilityLabel="Pounds" value={lbText} onChangeText={setLbText} keyboardType="number-pad" suffix="lb" placeholder="5" />
          </View>
          {errors.weight ? <AppText variant="caption" color="roseInk">{errors.weight}</AppText> : null}
        </View>
      ) : (
        <Field label="Today's weight (optional)" value={kgText} onChangeText={setKgText} keyboardType="decimal-pad" suffix="kg" placeholder="78.4" error={errors.weight} />
      )}
      <Button label="Save" block onPress={save} />
    </Screen>
  );
}
